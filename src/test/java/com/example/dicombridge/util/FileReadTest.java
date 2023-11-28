package com.example.dicombridge.util;

import com.example.dicombridge.domain.dto.thumbnail.ThumbnailDto;
import com.example.dicombridge.domain.dto.thumbnail.ThumbnailWithFileDto;
import com.example.dicombridge.repository.ImageRepository;
import jcifs.smb.SmbFileInputStream;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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

    private final ImageRepository imageRepository;
    private final ImageConvert imageConvert;
    private Map<String, ThumbnailDto> thumbnailDtoMap = new HashMap<>();
    private static final int NUMBER_OF_THREADS = 10;
    private ExecutorService executor;
    private int STUDYKEY_COUNT = 50;
    private int STUDYKEY = 16;

    @Autowired
    FileReadTest(ImageRepository imageRepository, ImageConvert imageConvert) {
        this.imageRepository = imageRepository;
        this.imageConvert = imageConvert;
        executor = Executors.newFixedThreadPool(NUMBER_OF_THREADS);
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
    public void getThumbnailFile() {
        Map<String, ThumbnailWithFileDto> thumbnailWithFileDtoMap = new ConcurrentHashMap<>();
        List<Callable<Void>> tasks = new ArrayList<>();

        long start = System.currentTimeMillis();
        for (String fname : thumbnailDtoMap.keySet()) {
            ThumbnailDto thumbnailDto = thumbnailDtoMap.get(fname);
            Callable<Void> task = getFileString(fname, thumbnailDto, thumbnailWithFileDtoMap);
            tasks.add(task);
        }
        // 실제 코드 실행시 스레드 이름 출력
//        executor.invokeAll(tasks);
//        for(Callable<Void> task : tasks) {
//            executor.submit(task);
//        }
        // 테스트 코드 실행시 스레드 이름 출력
        ForkJoinPool.commonPool().invokeAll(tasks); //  JUnit 5에서는 ForkJoinPool을 사용하는데, 이 스레드 풀에서 각 테스트를 실행
        long end = System.currentTimeMillis();
        System.out.println("이미지 변환 소요 시간 : " + (end-start));

        Assertions.assertEquals(STUDYKEY_COUNT, thumbnailWithFileDtoMap.size());
    }

    private Callable<Void> getFileString(String fname, ThumbnailDto thumbnailDto, Map<String, ThumbnailWithFileDto> thumbnailWithFileDtoMap) {
        ThumbnailWithFileDto thumbnailWithFileDto = new ThumbnailWithFileDto(thumbnailDto);
        Callable<Void> task = () -> {
            SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(thumbnailDto);
            byte[] byteArray = imageConvert.convert2ByteArray(smbFileInputStream);
            File dcmFile = imageConvert.convert2DcmFile(byteArray);
            String imgString = imageConvert.convertDcm2Jpg(dcmFile);

            thumbnailWithFileDto.setImage(imgString);
            thumbnailWithFileDtoMap.put(fname, thumbnailWithFileDto);

            System.out.println("현재 Thread 이름 : " + Thread.currentThread().getName());
            return null;
        };
        return task;
    }
}