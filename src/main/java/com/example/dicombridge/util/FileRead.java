package com.example.dicombridge.util;

import com.example.dicombridge.domain.dto.thumbnail.ThumbnailDto;
import com.example.dicombridge.domain.dto.thumbnail.ThumbnailWithFileDto;
import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.domain.PathAndName;
import jcifs.smb.SmbFileInputStream;
import lombok.NoArgsConstructor;

import javax.annotation.PostConstruct;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@NoArgsConstructor(force = true)
//@RequiredArgsConstructor
public class FileRead<T> {
    Map<String, byte[]> baMap = new HashMap<>();
    Map<String, T> baosMap = new HashMap<>();
    Map<String, T> returnMap = new HashMap<>();

    private final ImageConvert imageConvert;

    public FileRead(ImageConvert imageConvert) {
        this.imageConvert = imageConvert;
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
        byte[] byteArray = imageConvert.convert2ByteArray(smbFileInputStream);
        File dcmFile = imageConvert.convert2DcmFile(byteArray);
        String imgString = imageConvert.convertDcm2Jpg(dcmFile);
        return imgString;
    }

    public Callable<ThumbnailWithFileDto> getFileStringThread(ThumbnailDto thumbnailDto) {
        Callable<ThumbnailWithFileDto> task = () -> {
            ThumbnailWithFileDto thumbnailWithFileDto = new ThumbnailWithFileDto(thumbnailDto);
            SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(thumbnailDto);
            byte[] byteArray = imageConvert.convert2ByteArray(smbFileInputStream);
            File dcmFile = imageConvert.convert2DcmFile(byteArray);
            String imgString = imageConvert.convertDcm2Jpg(dcmFile);

            thumbnailWithFileDto.setImage(imgString);

            // System.out.println("현재 Thread 이름 : " + Thread.currentThread().getName());
            return thumbnailWithFileDto;
        };
        return task;
    }

    private void getBaos(Map<String, Image> map) throws IOException {
        for (String fname : map.keySet()) {
            SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(map.get(fname));
            byte[] byteArray = imageConvert.convert2ByteArray(smbFileInputStream);
            baMap.put(fname, byteArray);
        }
    }

    public <T extends PathAndName> ByteArrayOutputStream getBaos(T t) throws IOException {
        SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(t);
        ByteArrayOutputStream byteArrayOutputStream = imageConvert.convert2ByteArrayOutputStream(smbFileInputStream);

        return byteArrayOutputStream;
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