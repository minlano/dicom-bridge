package com.example.dicombridge.service.image;

import com.example.dicombridge.domain.dto.thumbnail.ThumbnailDto;
import com.example.dicombridge.domain.dto.thumbnail.ThumbnailWithFileDto;
import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.repository.ImageRepository;
import com.example.dicombridge.util.FileRead;
import com.example.dicombridge.util.ImageConvert;
import jcifs.Address;
import jcifs.CIFSContext;
import jcifs.CIFSException;
import jcifs.config.PropertyConfiguration;
import jcifs.context.BaseContext;
import jcifs.smb.NtlmPasswordAuthenticator;
import jcifs.smb.SmbException;
import jcifs.smb.SmbFile;
import jcifs.smb.SmbFileInputStream;
import lombok.RequiredArgsConstructor;
import org.dcm4che3.tool.dcm2jpg.Dcm2Jpg;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.UnknownHostException;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final ImageRepository imageRepository;
    private final ImageConvert imageConvert;
    private static final int NUMBER_OF_THREADS = 10;
    private static ExecutorService executor;

    @PostConstruct
    private void initialize() {
        createThread();
    }

    @PreDestroy
    private void cleanup() {
        executor.shutdown();
    }

    public static void createThread() {
        executor = Executors.newFixedThreadPool(NUMBER_OF_THREADS);
    }

    /** Seriesinsuid Count Check **/
    public int seriesinsuidCount(String seriesinsuid) {
        return imageRepository.countByseriesinsuid(seriesinsuid);
    }

    /** Thumbnail **/
    public Map<String, ThumbnailWithFileDto> getThumbnail(int studyKey) throws IOException, ExecutionException, InterruptedException {
        Map<String, ThumbnailDto> map = new HashMap<>();
        List<ThumbnailDto> images = imageRepository.findImageAndSeriesDesc(studyKey);

        for (int i = 0; i < images.size(); i++) {
            ThumbnailDto imageInfo = images.get(i);
            if (imageInfo.getImagekey() == 1) {
                map.put(imageInfo.getFname(), imageInfo);
            }
        }
        return getThumbnailFile(map);
    }

    public Map<String, ThumbnailWithFileDto> getThumbnailFile(Map<String, ThumbnailDto> thumbnailDtoMap) throws ExecutionException, InterruptedException {
        FileRead<Image> fileRead = new FileRead(imageConvert);
        List<Callable<ThumbnailWithFileDto>> tasks = new ArrayList<>();
        for (String fname : thumbnailDtoMap.keySet()) {
            ThumbnailDto thumbnailDto = thumbnailDtoMap.get(fname);
            Callable<ThumbnailWithFileDto> task = fileRead.getFileStringThread(thumbnailDto);
            tasks.add(task);
        }

        // executor.invokeAll(tasks);
        Map<String, ThumbnailWithFileDto> thumbnailWithFileDtoMap = new ConcurrentHashMap<>();
        for(Callable<ThumbnailWithFileDto> task : tasks) {
            Future<ThumbnailWithFileDto> future = executor.submit(task);
            thumbnailWithFileDtoMap.put(future.get().getFname(), future.get());
        }
        return thumbnailWithFileDtoMap;
    }

    /** Download **/
    public List<ByteArrayOutputStream> getFiles(int studyKey) throws IOException {
        FileRead<Image> fileRead = new FileRead(imageConvert);
        List<Image> images = imageRepository.findByImageIdStudykey(studyKey);

        List<ByteArrayOutputStream> tempFiles = new ArrayList<>();
        for (Image image : images) {
            ByteArrayOutputStream baos = fileRead.getBaos(image);
            tempFiles.add(baos);
        }
        return tempFiles;
    }

    public byte[] createZipFile(List<ByteArrayOutputStream> imageStreams, int studyKey) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {

            int index = 1;
            for (ByteArrayOutputStream imageStream : imageStreams) {
                zos.putNextEntry(new ZipEntry("image" + index + ".dcm"));
                imageStream.writeTo(zos);
                zos.closeEntry();
                index++;
            }
            zos.finish();
            return baos.toByteArray();
        }
    }

    /** Seriesinsuid Image By Count **/
    public File getFileByseriesinsuidNcount(String seriesinsuid, int order) throws IOException  {
        Pageable pageable = PageRequest.of(order-1,1);
        List<Image> images = imageRepository.findNthImageBySeriesinsuid(seriesinsuid, pageable);
        FileRead<Image> fileRead = new FileRead(imageConvert);
        return fileRead.getFile(images, 0);
    }

    /** Series Count **/
    public int findMaxStudyKeyByStudyKey(String studyInsUid) {
        return imageRepository.countDistinctSeries(studyInsUid).intValue();
    }

    /** Seriesinsuids By Studyinsuid **/
    public List<String> getSeriesInsUids(String studyInsUid) {
        return imageRepository.findDistinctSeriesInsUidByStudyinsuid(studyInsUid);
    }

    /** Redis **/
    public  List<String> saveRedisValSeriesinsuid(String studyinsuid) {
        String studyInsUid = studyinsuid;
        return imageRepository.findDistinctSeriesInsUidByStudyinsuid(studyInsUid);
    }

    /** Comparison **/
    public List<File> getComparisonImage(String seriesinsuid) throws IOException {
        List<Image> images = imageRepository.findImagesBySeriesinsuidOrderedByInstancenum(seriesinsuid);
        FileRead<Image> fileRead = new FileRead(imageConvert);
        List<File> tempFiles = new ArrayList<>();
        for (int i = 0; i < images.size(); i++) {
            tempFiles.add(fileRead.getFile(images, i));
        }
        return tempFiles;
    }
}