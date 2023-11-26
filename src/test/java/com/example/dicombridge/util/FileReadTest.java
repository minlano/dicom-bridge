package com.example.dicombridge.util;

import com.example.dicombridge.domain.dto.thumbnail.ThumbnailDto;
import com.example.dicombridge.domain.dto.thumbnail.ThumbnailWithFileDto;
import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.repository.ImageRepository;
import jcifs.smb.SmbFileInputStream;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

@SpringBootTest
class FileReadTest {

    @MockBean
    private final ImageRepository imageRepository;
    @MockBean
    private final ImageConvert imageConvert;
    private Map<String, ThumbnailDto> thumbnailDtoMap = new HashMap<>();
    private static final int NUMBER_OF_THREADS = 10;
    private int STUDYKEY_COUNT = 50;
    private int STUDYKEY = 16;


    FileReadTest(ImageRepository imageRepository, ImageConvert imageConvert) {
        this.imageRepository = imageRepository;
        this.imageConvert = imageConvert;
    }

    @BeforeEach
    public void getThumbnail() {
        List<ThumbnailDto> images = imageRepository.findImageAndSeriesDesc(STUDYKEY);

        for (int i = 0; i < images.size(); i++) {
            ThumbnailDto imageInfo = images.get(i);
            if (imageInfo.getImagekey() == 1)
                thumbnailDtoMap.put(imageInfo.getFname(), imageInfo);
        }
    }

    @Test
    @DisplayName("getThumbnailFile 메소드 테스트")
    public void getThumbnailFile() throws InterruptedException {
        Map<String, ThumbnailWithFileDto> thumbnailWithFileDtoMap = new ConcurrentHashMap<>();
        List<Callable<Void>> tasks = new ArrayList<>();

        long start = System.currentTimeMillis();
        for (String fname : thumbnailDtoMap.keySet()) {
            ThumbnailDto thumbnailDto = thumbnailDtoMap.get(fname);
            ThumbnailWithFileDto thumbnailWithFileDto = new ThumbnailWithFileDto(thumbnailDto);

            Callable<Void> task = () -> {
                SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(thumbnailDto);
                byte[] byteArray = imageConvert.convert2ByteArray(smbFileInputStream);
                File dcmFile = imageConvert.convert2DcmFile(byteArray);
                String imgString = imageConvert.convertDcm2Jpg(dcmFile);

                thumbnailWithFileDto.setImage(imgString);
                thumbnailWithFileDtoMap.put(fname, thumbnailWithFileDto);
                return null;
            };

            tasks.add(task);
        }
        ExecutorService executor = Executors.newFixedThreadPool(NUMBER_OF_THREADS);

//        executor.invokeAll(tasks);
        for(Callable<Void> task : tasks) {
            executor.submit(task);
            System.out.println("현재 Thread 이름 : " + Thread.currentThread().getName());
        }
        long end = System.currentTimeMillis();
        System.out.println("이미지 변환 소요 시간 : " + (end-start));

        Assertions.assertEquals(STUDYKEY_COUNT, thumbnailWithFileDtoMap.size());
    }
}