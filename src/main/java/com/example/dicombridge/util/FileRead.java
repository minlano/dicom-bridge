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
    private final ImageConvert imageConvert;

    public FileRead(ImageConvert imageConvert) {
        this.imageConvert = imageConvert;
    }

    public <T extends PathAndName> File getFile(List<T> image) throws IOException {
        SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(image.get(0));
        byte[] byteArray = imageConvert.convert2ByteArray(smbFileInputStream);
        File tempDcmFile = imageConvert.convert2DcmFile(byteArray);
        return tempDcmFile;
    }

    public Callable<ThumbnailWithFileDto> getFileStringThread(ThumbnailDto thumbnailDto) {
        Callable<ThumbnailWithFileDto> task = () -> {
            ThumbnailWithFileDto thumbnailWithFileDto = new ThumbnailWithFileDto(thumbnailDto);
            SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(thumbnailDto);
            byte[] byteArray = imageConvert.convert2ByteArray(smbFileInputStream);
            File dcmFile = imageConvert.convert2DcmFile(byteArray);
            String imgString = imageConvert.convertDcm2Jpg(dcmFile);

            thumbnailWithFileDto.setImage(imgString);
            return thumbnailWithFileDto;
        };
        return task;
    }

    public <T extends PathAndName> ByteArrayOutputStream getBaos(T t) throws IOException {
        SmbFileInputStream smbFileInputStream = imageConvert.getSmbFileInputStream(t);
        ByteArrayOutputStream byteArrayOutputStream = imageConvert.convert2ByteArrayOutputStream(smbFileInputStream);
        return byteArrayOutputStream;
    }
}