package com.example.dicombridge.service.fileRead;

import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.service.image.ImageService;
import jcifs.smb.SmbException;
import jcifs.smb.SmbFileInputStream;

import javax.persistence.Table;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;

public class FileRead<T> {
    Map<String, byte[]> baosMap = new HashMap<>();
    Map<String, T> returnMap = new HashMap<>();

    private ImageService imageService;

    public FileRead(ImageService imageService) {
        this.imageService = imageService;
    }

    /* 이거 성공하면 imageSerivce의 convert2ByteArrayOutputStream() 지워야 함 */
    public byte[] convert2ByteArrayOutputStream2(SmbFileInputStream smbFileInputStream) {
        byte[] buffer = new byte[1024 * 1024];
        try(ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
            int bytesRead;
            while ((bytesRead = smbFileInputStream.read(buffer)) != -1) {
                byteArrayOutputStream.write(buffer, 0, bytesRead);
            }
            smbFileInputStream.close();
            return byteArrayOutputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void getBaos(Map<String, Image> map) throws IOException {
        int check = 0 ;
        for (String fname : map.keySet()) {
            SmbFileInputStream smbFileInputStream = imageService.getSmbFileInputStream(map.get(fname));
            byte[] byteArrayOutputStream = convert2ByteArrayOutputStream2(smbFileInputStream);
            baosMap.put(fname, byteArrayOutputStream);
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
            File tempDcmFile = imageService.convert2DcmFile(baosMap.get(fname));
            String dcmByte = imageService.convertDcm2Jpg(tempDcmFile);
            returnMap.put(fname, (T)dcmByte);
        }
        return returnMap;
    }
}
