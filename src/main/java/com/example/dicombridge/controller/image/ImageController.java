package com.example.dicombridge.controller.image;

import com.example.dicombridge.service.image.ImageService;
import com.google.gson.Gson;
import org.dcm4che3.data.Attributes;
import org.dcm4che3.data.Tag;
import org.dcm4che3.imageio.codec.TransferSyntaxType;
import org.dcm4che3.imageio.plugins.dcm.DicomImageReadParam;
import org.dcm4che3.imageio.plugins.dcm.DicomImageReader;
import org.dcm4che3.io.DicomInputStream;
import org.dcm4che3.tool.dcm2jpg.Dcm2Jpg;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import javax.imageio.ImageReadParam;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Iterator;

//@Controller
@RestController
public class ImageController {
    private static Gson gson = new Gson();

    private final ImageReader imageReader = (ImageReader)ImageIO.getImageReadersByFormatName("JPEG").next();

    @GetMapping("/showDicomImage")
    public String showDicomImage(HttpServletResponse response) {
        // 이미지 파일 경로
        String dicomImagePath = "C:/Users/TJ/Desktop/dicom/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";

        String libraryPath = System.getProperty("java.library.path");
        String[] paths = libraryPath.split(System.getProperty("path.separator"));
        System.out.println("Individual paths:");
        for (String path : paths) {
            System.out.println(path);
        }

        try {
            File dicomFile = new File(dicomImagePath);
            Dcm2Jpg dcm2Jpg = new Dcm2Jpg();
            BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(dicomFile);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return "haha";
//        return "showImage";
    }

//    @GetMapping("/showDicomImage")
//    public ResponseEntity<byte[]> showDicomImage(@RequestParam("referencedSOPInstanceUID") String referencedSOPInstanceUID) {
//        try {
//            byte[] imageData = ImageService.getUID(referencedSOPInstanceUID);
//
//            if (imageData != null) {
//                HttpHeaders headers = new HttpHeaders();
//                headers.setContentType(MediaType.IMAGE_JPEG);
//                return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
//            } else {
//                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 이미지를 찾지 못한 경우
//            }
//        } catch (IOException e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 오류 발생시
//        }
//    }




}
