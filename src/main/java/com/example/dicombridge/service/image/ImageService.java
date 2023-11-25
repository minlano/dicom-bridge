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
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.UnknownHostException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@RequiredArgsConstructor
public class ImageService {
    /**
     * Storage 클래스에 구현했으므로 빼야함
     */
    @Value("${storage.server.username}")
    private String USERNAME;
    @Value("${storage.server.password}")
    private String PASSWORD;
    @Value("${storage.protocol}")
    private String PROTOCOL;
    @Value("${storage.host}")
    private String HOST;
    @Value("${storage.shared-name}")
    private String SHARED_NAME;
    private final ImageRepository imageRepository;
    private final ImageConvert imageConvert;
    private CIFSContext cifsContext;

    @PostConstruct
    private void initialize() {
        storageConnection();
    }

    private void storageConnection() {
        Properties properties = new Properties();
        properties.setProperty("jcifs.smb.client.responseTimeout", "5000");
        try {
            PropertyConfiguration configuration = new PropertyConfiguration(properties);
            NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(null, USERNAME, PASSWORD);
            this.cifsContext = new BaseContext(configuration).withCredentials(auth);
            Address address = cifsContext.getNameServiceClient().getByName(HOST);
            cifsContext.getTransportPool().logon(cifsContext, address);
        } catch (UnknownHostException | CIFSException e) {
            throw new RuntimeException(e);
        }
    }

    /** ImageConvert 클래스에 구현했으므로 빼야함 **/
    public SmbFileInputStream getSmbFileInputStream(Image image) throws MalformedURLException, SmbException {
        SmbFile file = new SmbFile(String.join("/", PROTOCOL, HOST, SHARED_NAME, image.getPath().replace('\\', '/') + "/" + image.getFname()), cifsContext);
        return new SmbFileInputStream(file);
    }

    public ByteArrayOutputStream convert2ByteArrayOutputStream(SmbFileInputStream smbFileInputStream) {
        ByteArrayOutputStream byteArrayOutputStream;
        byte[] buffer = new byte[1024 * 1024];
        try {
            byteArrayOutputStream = new ByteArrayOutputStream();

            int bytesRead;
            while ((bytesRead = smbFileInputStream.read(buffer)) != -1) {
                byteArrayOutputStream.write(buffer, 0, bytesRead);
            }
            smbFileInputStream.close();
            byteArrayOutputStream.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return byteArrayOutputStream;
    }

    public File convert2DcmFile(byte[] fileBytes) throws IOException {
        File tempFile = File.createTempFile("tempfile", ".dcm");
        //스토리지에서 cifs로 읽어들인 dicomFile의 temp(로컬에는 저장안되고 메모리에 저장됨)
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(fileBytes);
        } catch (Exception e) {
            System.err.println(e);
        }
        return tempFile;
    }

    public String convertDcm2Jpg(File file) {
        try {
            Dcm2Jpg dcm2Jpg = new Dcm2Jpg();
            BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(file);

            if (image != null) {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(image, "jpg", baos);
                byte[] imageBytes = baos.toByteArray();
                return Base64.getEncoder().encodeToString(imageBytes);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /** ImageConvert 클래스에 구현했으므로 빼야함 **/

    /** Seriesinsuid Count Check **/
    public int seriesinsuidCount(String seriesinsuid) {
        return imageRepository.countByseriesinsuid(seriesinsuid);
    }

    /** Thumbnail **/
    public Map<String, ThumbnailWithFileDto> getThumbnail(int studyKey) throws IOException {
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

    public Map<String, ThumbnailWithFileDto> getThumbnailFile(Map<String, ThumbnailDto> thumbnailDtoMap) throws IOException {
        Map<String, ThumbnailWithFileDto> thumbnailWithFileDtoMap = new HashMap<>();
        FileRead<Image> fileRead = new FileRead(imageConvert);

//        long start = System.currentTimeMillis();
        for (String fname : thumbnailDtoMap.keySet()) {
            ThumbnailDto thumbnailDto = thumbnailDtoMap.get(fname);
            ThumbnailWithFileDto thumbnailWithFileDto = new ThumbnailWithFileDto(thumbnailDto);

            String dcmByte = fileRead.getFileString(thumbnailDto);

            thumbnailWithFileDto.setImage(dcmByte);
            thumbnailWithFileDtoMap.put(fname, thumbnailWithFileDto);
        }
//        long end = System.currentTimeMillis();
//        System.out.println("이미지 변환 시간 : " + (end-start));

        return thumbnailWithFileDtoMap;
    }

    /** Download **/
    public List<ByteArrayOutputStream> getFiles(int studyKey) throws IOException {
        List<Image> images = imageRepository.findByImageIdStudykey(studyKey);
        Map<String, Image> map = images.stream().collect(Collectors.toMap(
                i -> i.getFname(),
                i -> i
        ));

        List<ByteArrayOutputStream> tempFiles = new ArrayList<>();
        for (String fname : map.keySet()) {
            SmbFileInputStream smbFileInputStream = getSmbFileInputStream(map.get(fname));
            ByteArrayOutputStream byteArrayOutputStream = convert2ByteArrayOutputStream(smbFileInputStream);

            tempFiles.add(byteArrayOutputStream);
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
        return fileRead.getFile(images);
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
        Map<String, Image> map = new LinkedHashMap<>();
        List<Image> images = imageRepository.findImagesBySeriesinsuidOrderedByInstancenum(seriesinsuid);

        for (int i = 0; i < images.size(); i++) {
            Image image = images.get(i);
            map.put(image.getFname(), image);
        }
        return fileRead3(map);
    }

    public List<File> getcomparisonbyte(String seriesinsuid) throws IOException {
        Map<String, Image> map = new HashMap<>();
        List<Image> images = imageRepository.findByseriesinsuid(seriesinsuid);

        for (int i = 0; i < images.size(); i++) {
            Image image = images.get(i);
            map.put(image.getFname(), image);
        }
        return fileRead3(map);
    }

    private List<File> fileRead3(Map<String, Image> imageMap) throws IOException {
        List<File> tempFiles = new ArrayList<>();

        for (String fname : imageMap.keySet()) {
            SmbFileInputStream smbFileInputStream = getSmbFileInputStream(imageMap.get(fname));
            ByteArrayOutputStream byteArrayOutputStream = convert2ByteArrayOutputStream(smbFileInputStream);
            File tempDcmFile = convert2DcmFile(byteArrayOutputStream.toByteArray());

            tempFiles.add(tempDcmFile);
        }
        return tempFiles;
    }
}