package com.example.dicombridge.controller.image;


import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

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
//    @GetMapping("/viewDicomImage")
//    public String showDicomImage(Model model) {
//        String dicomImagePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//
//        try {
//            File dicomFile = new File(dicomImagePath);
//
//            Dcm2Jpg dcm2Jpg = new Dcm2Jpg();
//
//            BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(dicomFile);
//
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            ImageIO.write(image, "jpg", baos);
//            byte[] imageBytes = baos.toByteArray();
//            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//
//            model.addAttribute("dicomImageBase64", base64Image);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//        return "viewPage";
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

//    @GetMapping("/viewDicomImage")
//    public String showDicomImage(Model model) {
//        String dicomImagePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//
//        try {
//            File dicomFile = new File(dicomImagePath);
//
//            Dcm2Jpg dcm2Jpg = new Dcm2Jpg();
//            BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(dicomFile);
//
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            ImageIO.write(image, "jpg", baos);
//            byte[] imageBytes = baos.toByteArray();
//
//            // 이미지를 Base64로 인코딩
//            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//
//            // Base64 인코딩된 이미지를 모델에 추가
//            model.addAttribute("dicomImageBase64", base64Image);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//        return "viewPage";
//    }
//    @GetMapping("/viewDicomImage")
//    public String viewDicomImage(Model model) {
//        // DICOM 이미지 파일 경로
//        String dicomFilePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//
//        File dicomFile = new File(dicomFilePath);
////
////            // DICOM 파일 메타데이터 읽기
////            DicomInputStream dis = new DicomInputStream(dicomFile);
////            Attributes attributes = dis.readDataset();
//
//        // DICOM 메타데이터를 모델에 추가
//        model.addAttribute("dicomMetadata", dicomFile);
//
//        return "viewPage"; // JSP 페이지 이름 (이를 사용하여 메타데이터를 표시)
//    }
//    @GetMapping("/viewDicomImage")
//    public String viewDicomImage(Model model) {
//
//        // DICOM 이미지 URL 생성
//        String dicomImageUrl = "/"+ "dicom-images/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//
//        // DICOM 이미지 URL을 모델에 추가
//        model.addAttribute("dicomImageUrl", dicomImageUrl);
//
//        return "viewPage"; // JSP 페이지 이름
//    }
    @GetMapping("/viewDicomImage")
    public String viewDicomImage(Model model) {
        // DICOM 이미지의 wadouri URI를 설정
        String dicomImageUri = "wadouri://localhost:8080/dcmfile/MR.1.2.392.200036.9116.4.1.6116.40033.5.3001.1.1152393810.dcm";
        //String dicomImageUri = "wadouri://Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
        // DICOM 이미지의 URI를 모델에 추가
        model.addAttribute("dicomImageUri", dicomImageUri);

        return "viewPage"; // JSP 페이지 이름
    }
}

    














