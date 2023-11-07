package com.example.dicombridge.controller.image;


import org.dcm4che3.tool.dcm2jpg.Dcm2Jpg;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Base64;


@Controller
public class ImageControllerJH {
//    @GetMapping("/viewDicomImage")
//    public String viewDicomImage(Model model) {
//        System.out.println("controller 확인");
//        //String dicomFilePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//        String dicomFilePath = "/Users/jeonghoonoh/Desktop/스크린샷 2023-10-24 오전 9.45.07.png";
//        System.out.println("dicomFilePath 확인");
//        BufferedImage dicomImage = ImageLoadUtil.convertDicomToJpg(dicomFilePath);
//        System.out.println("dicomImage 확인");
//        if (dicomImage != null) {
//            model.addAttribute("dicomImage", dicomImage);
//            return "dicomImageView";
//        } else {
//
//            return "errorPage";
//        }
//    }
//    @GetMapping("/viewDicomImage")
//    public String showDicomImage(Model model) {
//        // 이미지 파일 경로
//        String dicomImagePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CT-Abdomen/1.3.12.2.1107.5.1.4.65266.30000018122721584475300010495.dcm";
//
//        try {
//            File dicomFile = new File(dicomImagePath);
//
//            // DicomInputStream dis = new DicomInputStream(dicomFile);
//
//            // ImageReader 초기화 및 DICOM 이미지 읽기
//            Iterator<ImageReader> readers = ImageIO.getImageReadersByFormatName("DICOM");
//
//            ImageReader imageReader = readers.next();
//
//            ImageInputStream iis = ImageIO.createImageInputStream(dicomFile);
//
//            imageReader.setInput(iis);
//
//            BufferedImage image = imageReader.read(0, new DicomImageReadParam());
//
//            // BufferedImage를 Base64 문자열로 변환
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            ImageIO.write(image, "jpg", baos);
//            byte[] imageBytes = baos.toByteArray();
//            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//
//            // Base64 문자열을 모델에 추가
//            model.addAttribute("dicomImageBase64", base64Image);
//            System.out.println("base64Image 확:" + base64Image);
//        } catch (IOException e) {
//            // 이미지 파일을 읽는 도중 오류 발생 시 처리
//            e.printStackTrace();
//        }
//
//        return "dicomImageView";
//    }
    @GetMapping("/viewDicomImage")
    public String showDicomImage(Model model) {
        String dicomImagePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";

        try {
            File dicomFile = new File(dicomImagePath);

            Dcm2Jpg dcm2Jpg = new Dcm2Jpg();

            BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(dicomFile);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "jpg", baos);
            byte[] imageBytes = baos.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            model.addAttribute("dicomImageBase64", base64Image);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "dicomImageView";
    }
//    @GetMapping("/viewDicomImage")
//    public String showDicomImage(Model model) {
//        String dicomImagePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//
//        try {
//            File dicomFile = new File(dicomImagePath);
//
//            // ImageReader 초기화 및 DICOM 이미지 읽기
//            ImageReader imageReader = ImageIO.getImageReadersByFormatName("DICOM").next();
//            ImageInputStream iis = new FileImageInputStream(dicomFile);
//            imageReader.setInput(iis);
//
//            BufferedImage image = imageReader.read(0, new DicomImageReadParam());
//
//            // BufferedImage를 Base64 문자열로 변환
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            ImageIO.write(image, "jpg", baos);
//            byte[] imageBytes = baos.toByteArray();
//            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//
//            // Base64 문자열을 모델에 추가
//            model.addAttribute("dicomImageBase64", base64Image);
//            System.out.println("base64Image 확:" + base64Image);
//        } catch (IOException e) {
//            // 이미지 파일을 읽는 도중 오류 발생 시 처리
//            e.printStackTrace();
//        }
//
//        return "dicomImageView";
//    }

//    @GetMapping("/viewDicomImage")
//    public String showDicomImage(Model model) {
//        String dicomImagePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm" ;
//
//        try {
//            File dicomFile = new File(dicomImagePath);
//
//            DicomInputStream dis = new DicomInputStream(dicomFile);
//            Attributes dcmAttrs = dis.readDataset(-1, -1);
//
//            // Convert DICOM to JPG
//            BufferedImage image = convertDicomToJpg(dicomFile);
//
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            ImageIO.write(image, "jpg", baos);
//            byte[] imageBytes = baos.toByteArray();
//            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//
//            // 이제 'base64Image' 변수에 DICOM 이미지를 JPEG로 변환한 이미지를 Base64 문자열로 저장합니다
//            System.out.println("base64Image 확인: " + base64Image);
//
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//
//        return "dicomImageView" ;
//    }
//
//    private BufferedImage convertDicomToJpg(File dicomFile) throws IOException {
//        ImageReader imageReader = null;
//        BufferedImage image = null;
//        ImageInputStream iis = ImageIO.createImageInputStream(dicomFile);
//
//        try {
//            Iterator<ImageReader> readers = ImageIO.getImageReaders(iis);
//            if (readers.hasNext()) {
//                imageReader = readers.next(); // 여기가 문제
//                imageReader.setInput(iis);
//
//                image = imageReader.read(0);
//            }
//        } finally {
//            if (imageReader != null) {
//                imageReader.dispose();
//            }
//        }
//
//        return image;
//    }

//    @GetMapping("/viewDicomImage")
//    public String showDicomImage(Model model) {
//        String dicomImagePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//
//        try {
//            File dicomFile = new File(dicomImagePath);
//
//            // ImageReader 초기화 및 DICOM 이미지 읽기
//            ImageReader imageReader = ImageIO.getImageReadersByFormatName("DICOM").next();
//            ImageInputStream iis = new FileImageInputStream(dicomFile);
//            imageReader.setInput(iis);
//
//            BufferedImage image = imageReader.read(0, new DicomImageReadParam());
//
//            // BufferedImage를 Base64 문자열로 변환
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            ImageIO.write(image, "jpg", baos);
//            byte[] imageBytes = baos.toByteArray();
//            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//
//            // Base64 문자열을 모델에 추가
//            model.addAttribute("dicomImageBase64", base64Image);
//            System.out.println("base64Image 확:" + base64Image);
//        } catch (IOException e) {
//            // 이미지 파일을 읽는 도중 오류 발생 시 처리
//            e.printStackTrace();
//        }
//
//        return "dicomImageView";
//    }
}

    














