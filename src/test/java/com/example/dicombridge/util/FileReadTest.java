package com.example.dicombridge.util;

import com.example.dicombridge.domain.dto.thumbnail.ThumbnailDto;
import com.example.dicombridge.repository.ImageRepository;
import jcifs.smb.SmbFileInputStream;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.event.annotation.BeforeTestMethod;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadPoolExecutor;

@SpringBootTest
class FileReadTest {

    private final ImageRepository imageRepository;
    private final ImageConvert imageConvert;
    private static final int NUMBER_OF_THREADS = 10;
    private static ThreadPoolExecutor executor;
    private int STUDYKEY = 16;
    private int STUDYKEY_COUNT = 50;

    private Map<String, ThumbnailDto> thumbnailDtoMap = new HashMap<>();

    @Autowired
    FileReadTest(ImageRepository imageRepository, ImageConvert imageConvert) {
        this.imageRepository = imageRepository;
        this.imageConvert = imageConvert;
    }

//    @Test
//    void run() {
//    }

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
    @DisplayName("getFileString 메소드 테스트")
    public void getFileString() throws IOException {
//        executor = (ThreadPoolExecutor) Executors.newFixedThreadPool(NUMBER_OF_THREADS);

        long start = System.currentTimeMillis();

        int countCheck = 0;
        for(String fname : thumbnailDtoMap.keySet()) {
            ThumbnailDto thumbnailDto = thumbnailDtoMap.get(fname);

            SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(thumbnailDto);
            // 멀티스레드 적용 구간
            byte[] byteArray = imageConvert.convert2ByteArray(smbFileInputStream);
            File dcmFile = imageConvert.convert2DcmFile(byteArray);
            String imgString = imageConvert.convertDcm2Jpg(dcmFile);
            // 멀티스레드 적용 구간
            countCheck++;
        }
        long end = System.currentTimeMillis();
        System.out.println("이미지 변환 소요 시간 : " + (end-start));

        Assertions.assertEquals(STUDYKEY_COUNT, countCheck);
    }
}