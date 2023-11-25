package com.example.dicombridge.util;

import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.domain.PathAndName;
import jcifs.smb.SmbFileInputStream;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@NoArgsConstructor(force = true)
@RequiredArgsConstructor
public class FileRead<T> implements Runnable {
    Map<String, byte[]> baMap = new HashMap<>();
    Map<String, T> baosMap = new HashMap<>();
    Map<String, T> returnMap = new HashMap<>();

    private final ImageConvert imageConvert;

    private static final int NUMBER_OF_THREADS = 10;
    private static Executor executor;

    @PostConstruct
    private void initialize() {
        createThread();
    }

    public static void createThread() {
        executor = Executors.newFixedThreadPool(NUMBER_OF_THREADS);
    }

    @Override
    public void run() {
    }

    /** 테스트 정훈 형님꺼 이거 사용해서 하면 좋을듯 **/
    public void toMap(List<? extends PathAndName> images) {
        baosMap = (Map<String, T>) images.stream().collect(Collectors.toMap(
                i -> i.getFname(),
                i -> i
        ));
    }
    /** 테스트 **/

    public <T extends PathAndName> File getFile(List<T> image) throws IOException {
        SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(image.get(0));
        byte[] byteArray = imageConvert.convert2ByteArray(smbFileInputStream);
        File tempDcmFile = imageConvert.convert2DcmFile(byteArray);
        return tempDcmFile;
    }

    public <T extends PathAndName> String getFileString(T t) throws IOException {
        SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(t);

        // 멀티스레드 적용 구간
        byte[] byteArray = imageConvert.convert2ByteArray(smbFileInputStream);
        File dcmFile = imageConvert.convert2DcmFile(byteArray);
        String imgString = imageConvert.convertDcm2Jpg(dcmFile);
        // 멀티스레드 적용 구간

        return imgString;
    }

    private void getBaos(Map<String, Image> map) throws IOException {
        for (String fname : map.keySet()) {
            SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(map.get(fname));
            byte[] byteArray = imageConvert.convert2ByteArray(smbFileInputStream);
            baMap.put(fname, byteArray);
        }
    }

    public Map<String, T> getFiles(Map<String, Image> map) throws IOException {
        getBaos(map);
        for (String fname : baMap.keySet()) {
            returnMap.put(fname, (T)baMap.get(fname));
        }
        return returnMap;
    }

//    public Map<String, T> getFilesString(Map<String, Image> map) throws IOException {
//        getBaos(map);
//        for (String fname : baMap.keySet()) {
//            File tempDcmFile = imageConvert.convert2DcmFile(baMap.get(fname));
//            String dcmByte = imageConvert.convertDcm2Jpg(tempDcmFile);
//            returnMap.put(fname, (T)dcmByte);
//        }
//        return returnMap;
//    }
}