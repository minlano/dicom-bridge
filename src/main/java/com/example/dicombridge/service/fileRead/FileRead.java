package com.example.dicombridge.service.fileRead;

import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.service.image.ImageService;
import com.example.dicombridge.util.ImageConvert;
import jcifs.smb.SmbFileInputStream;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class FileRead<T> {
    Map<String, byte[]> baosMap = new HashMap<>();
    Map<String, T> returnMap = new HashMap<>();
    private final ImageConvert imageConvert;

    public void getBaos(Map<String, Image> map) throws IOException {
        for (String fname : map.keySet()) {
            SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(map.get(fname));
            byte[] byteArray = imageConvert.convert2ByteArrayOutputStream(smbFileInputStream);
            baosMap.put(fname, byteArray);
        }
    }

    public Map<String, T> getFiles(Map<String, Image> map) throws IOException {
        getBaos(map);
        // forEach 이용해서 가독성 높일 수 있는 방법 찾아보기
        for (String fname : baosMap.keySet()) {
            returnMap.put(fname, (T)baosMap.get(fname));
        }
        return returnMap;
    }

    public Map<String, T> getFilesString(Map<String, Image> map) throws IOException {
        getBaos(map);
        // forEach 이용해서 가독성 높일 수 있는 방법 찾아보기
        for (String fname : baosMap.keySet()) {
            File tempDcmFile = imageConvert.convert2DcmFile(baosMap.get(fname));
            String dcmByte = imageConvert.convertDcm2Jpg(tempDcmFile);
            returnMap.put(fname, (T)dcmByte);
        }
        return returnMap;
    }

    public File getFile(List<Image> image) throws IOException {
        SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(image.get(0));
        byte[] byteArray = imageConvert.convert2ByteArrayOutputStream(smbFileInputStream);
        File tempDcmFile = imageConvert.convert2DcmFile(byteArray);
        return tempDcmFile;
    }
}