package com.example.dicombridge.controller.image;


import org.dcm4che3.imageio.plugins.dcm.DicomImageReadParam;
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

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.jar.Attributes;


@Controller
public class ImageController {


    @GetMapping("/showDicomImage")
    public String showDicomImage(HttpServletResponse response) {
        // 이미지 파일 경로
        String dicomImagePath = "C:/Users/TJ/Documents/선소현/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";

        try {
            File dicomFile = new File(dicomImagePath);

            Dcm2Jpg dcm2Jpg = new Dcm2Jpg();

            BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(dicomFile);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "jpeg", baos);


            //이미지데이터를 바이트 배열로 복사해 imageBytes 변수에 저장
            byte[] imageData  = baos.toByteArray();

            //String base64Image = Base64.getEncoder().encodeToString(imageData);
            //model.addAttribute("dicomImage", base64Image);

            //이미지 전송
            response.setContentType("image/jpeg");
            response.setContentLength(imageData.length);
            response.getOutputStream().write(imageData);

        } catch (IOException e) {
            e.printStackTrace();
        }

        return "showImage";
    }


//    @GetMapping("/DicomImage")
//    public void DicomImage(HttpServletResponse response) {
//        // DICOM 파일 경로
//        String dicomPath = "C:/Users/TJ/Documents/선소현/DCM-Sample4KDT/CR-Chest PA";
//
//        try {
//            Dcm2Jpg dcm2Jpg = new Dcm2Jpg();
//            dcm2Jpg.initImageWriter("JPEG", "jpg", "com.sun.imageio.plugins.jpeg.JPEGImageWriter", null, null);
//
//            File dicomFile = new File(dicomPath);
//
//            // DICOM 파일을 이미지로 변환
//            BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(dicomFile);
//
//            // 이미지 전송
//            response.setContentType("image/jpeg");
//            OutputStream out = response.getOutputStream();
//
//            // 이미지를 JPEG 형식으로 출력 스트림에 작성
//            ImageIO.write(image, "jpeg", out);
//            out.flush();
//
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }


    @GetMapping("/showDicomImages")
    public List<String> showDicomImages(@RequestParam String path) {
        List<String> imageUrls = new ArrayList<>();

        File dicomFiles = new File(path);

        if (dicomFiles.isDirectory()) {
            File[] files = dicomFiles.listFiles((dir, name) -> name.toLowerCase().endsWith(".dcm"));

            if (files != null) {
                for (File file : files) {
                    try {
                        Dcm2Jpg dcm2Jpg = new Dcm2Jpg();
                        BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(file);

                        if (image != null) {
                            String imageUrl = "images/" + file.getName() + ".jpg"; // 이미지 파일 경로
                            ImageIO.write(image, "jpg", new File(imageUrl));
                            imageUrls.add(imageUrl);
                        }

                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }

        return imageUrls;

    }







}
