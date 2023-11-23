package com.example.dicombridge.util;

import com.example.dicombridge.domain.image.Image;
import jcifs.smb.SmbFileInputStream;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import jcifs.smb.SmbException;
import jcifs.smb.SmbFile;

import org.dcm4che3.tool.dcm2jpg.Dcm2Jpg;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.MalformedURLException;
import java.util.*;

@Component
@RequiredArgsConstructor
public class ImageConvert {
    private final Storage storage;

    public SmbFileInputStream getSmbFileInputStream(Image image) throws MalformedURLException, SmbException {
        SmbFile file = new SmbFile(String.join("/",
                storage.getPROTOCOL(),
                storage.getHOST(),
                storage.getSHARED_NAME(),
                image.getPath().replace('\\', '/') + "/" + image.getFname()),
                storage.getCifsContext());
        return new SmbFileInputStream(file);
    }

    // 오리지널 convert2ByteArrayOutputStream
//    @Deprecated
//    public ByteArrayOutputStream convert2ByteArrayOutputStream2(SmbFileInputStream smbFileInputStream) {
//        ByteArrayOutputStream byteArrayOutputStream;
//        byte[] buffer = new byte[1024 * 1024];
//        try {
//            byteArrayOutputStream = new ByteArrayOutputStream();
//            int bytesRead;
//            while ((bytesRead = smbFileInputStream.read(buffer)) != -1) {
//                byteArrayOutputStream.write(buffer, 0, bytesRead);
//            }
//            smbFileInputStream.close();
//            byteArrayOutputStream.close();
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//        return byteArrayOutputStream;
//    }

    public byte[] convert2ByteArrayOutputStream(SmbFileInputStream smbFileInputStream) {
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
}
