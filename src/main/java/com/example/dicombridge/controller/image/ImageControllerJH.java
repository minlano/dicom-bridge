package com.example.dicombridge.controller.image;


import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.CrossOrigin;
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

        String dicomImageUri = "wadouri://localhost:8083/dcmfile/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";

        model.addAttribute("dicomImageUri", dicomImageUri);

        return "viewPage"; // JSP 페이지 이름
    }

//    @GetMapping("/viewDicomImage")
//    public String viewDicomImage(Model model) {
//
//        String dicomFilePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//
//        // DICOM 파일을 정적 리소스 디렉토리로 복사
//        try {
//            File sourceFile = new File(dicomFilePath);
//            String tempDirectory = System.getProperty("java.io.tmpdir"); // 시스템의 임시 디렉토리를 가져옵니다.
//            String targetFileName = "1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//            File targetFile = new File(tempDirectory, targetFileName);
//
//            // 파일 복사
//            FileUtils.copyFile(sourceFile, targetFile);
//            System.out.println("Copied DICOM file path: " + targetFile.getAbsolutePath());
//
//            Thread.sleep(1000);
//            // 복사된 DICOM 파일의 URI를 설정
//            String dicomImageUri = "wadouri://localhost:8083/dicom-images/" + targetFileName;
//            System.out.println("dicomImageUri : "+dicomImageUri);
//            // DICOM 이미지의 URI를 모델에 추가
//            model.addAttribute("dicomImageUri", dicomImageUri);
//        } catch (IOException e) {
//            // 처리 중 오류가 발생한 경우 예외 처리
//            e.printStackTrace();
//        } catch (InterruptedException e) {
//            throw new RuntimeException(e);
//        }
//
//        return "viewPage"; // JSP 페이지 이름
//    }
////    @GetMapping("/viewDicomImage")
////    public String viewDicomImage(Model model) {
////        // DICOM 이미지 파일 경로
////        String dicomFilePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
////
////        // 파일 경로에서 파일 이름 추출
////        File dicomFile = new File(dicomFilePath);
////        String dicomFileName = dicomFile.getName();
////
////        // 웹 서버 URL을 생성 (로컬호스트로 변경)
////        String webServerBaseUrl = "http://localhost:8083";
////        String dicomImageUri = webServerBaseUrl + "/dicom-images/" + dicomFileName;
////
////        // DICOM 이미지의 URI를 모델에 추가
////        model.addAttribute("dicomImageUri", dicomImageUri);
////        System.out.println("dicomImageUri:" + dicomImageUri);
////        return "viewPage"; // JSP 페이지 이름
////    }
//
////
////    @GetMapping("/viewDicomImage")
////    public String viewDicomImage(Model model) {
////        String dicomFilePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
////
////        try {
////            File dicomFile = new File(dicomFilePath);
////            Path dicomPath = dicomFile.toPath();
////            byte[] dicomBytes = Files.readAllBytes(dicomPath);
////
////            model.addAttribute("dicomBytes", dicomBytes);
////            System.out.println("DICOM Bytes: " + dicomBytes.length + " bytes");
////
////        } catch (IOException e) {
////            e.printStackTrace();
////        }
////
////        return "viewPage";
////    }
//
//
//    private static final Path sourceDicomFilePath = Path.of("/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm");
//    private static final Path copiedDicomFilePath = Path.of("src/main/resources/static/dicom-image/1.2.410.200013.1.510.1.20210310170346701.0009.dcm");
//    @GetMapping("/viewDicomImage")
//    public String viewDicomImage(Model model) {
//        if (Files.notExists(copiedDicomFilePath)) {
//            try {
//                // DICOM 파일 복사
//                Files.copy(sourceDicomFilePath, copiedDicomFilePath);
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }
//
//        // DICOM 이미지의 wadouri URI를 설정
//        String dicomImageUri = "wadouri:" + copiedDicomFilePath;
//
//        // DICOM 이미지의 URI를 모델에 추가
//        model.addAttribute("dicomImageUri", dicomImageUri);
//
//        return "viewPage"; // JSP 페이지 이름
//    }
//
//    @Scheduled(fixedRate = 30000) // 30초 간격으로 스케줄링 (시간은 밀리초 단위)
//    public void cleanupDicomFile() {
//        if (Files.exists(copiedDicomFilePath)) {
//            try {
//                Files.delete(copiedDicomFilePath); // 파일 삭제
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }
//    }


//    @GetMapping("/viewDicomImage")
//    public String viewDicomImage(Model model) {
//        // DICOM 이미지의 파일 경로 설정
//        String dicomFilePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//
//        // 새로운 경로 설정: static/dicom-image 디렉토리로 복사
//        String destinationPath = "src/main/resources/static/dicom-images/";
//
//        try {
//            // 파일을 복사하기 위해 FileInputStream을 생성
//            FileInputStream inputStream = new FileInputStream(new File(dicomFilePath));
//
//            // 복사할 파일의 경로와 파일 이름 설정
//            String fileName = Paths.get(dicomFilePath).getFileName().toString();
//            String destinationFilePath = destinationPath + fileName;
//
//            // 파일 복사
//            Files.copy(inputStream, Paths.get(destinationFilePath), StandardCopyOption.REPLACE_EXISTING);
//
//            // 복사된 파일이 존재하는지 확인
//            if (Files.exists(Paths.get(destinationFilePath))) {
//                // DICOM 이미지의 wadouri URI를 설정
//                String dicomImageUri = "wadouri://localhost:8083/dicom-images/" + fileName;
//
//                // 모델에 속성 추가
//                model.addAttribute("dicomImageUri", dicomImageUri);
//
//                // JSP 페이지 이름 반환
//                return "viewPage";
//            } else {
//                // 복사된 파일이 존재하지 않는 경우 처리
//                return "errorPage";
//            }
//        } catch (IOException e) {
//            // 파일 복사 중 예외 발생 시 처리
//            e.printStackTrace();
//            // 예외 처리에 따른 반환 또는 리다이렉트 등을 수행할 수 있음
//            return "errorPage";
//        }
//    }
//    @Scheduled(fixedDelay = 10000) // 10초 딜레이
//    public void deleteDicomFile() {
//        // 예약된 작업에서 호출될 메서드
//        try {
//            // 삭제할 파일의 경로
//            Path fileToDelete = Paths.get("src/main/resources/static/dicom-images/");
//
//            // 파일 삭제
//            Files.deleteIfExists(fileToDelete);
//
//            // 파일이 성공적으로 삭제되었는지 확인
//            if (!Files.exists(fileToDelete)) {
//                System.out.println("DICOM 파일이 성공적으로 삭제되었습니다.");
//            } else {
//                System.out.println("DICOM 파일 삭제에 실패했습니다.");
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
//    @GetMapping("/viewDicomImage")
//    public String viewDicomImage(Model model) {
//        // DICOM 이미지의 파일 경로 설정
//        String dicomFilePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//
//        model.addAttribute("dicomFilePath", dicomFilePath);
//
//        return "viewPage"; // JSP 페이지 이름
//    }
//    @GetMapping(value = "/getDicomImageData", produces = "application/dicom")
//    @ResponseBody
//    public byte[] getDicomImageData() throws IOException {
//        // DICOM 이미지의 파일 경로 설정
//        String dicomFilePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//        Path path = Paths.get(dicomFilePath);
//
//        return Files.readAllBytes(path);
//    }


    @GetMapping("/viewDicomImageJong")
    public String viewDicomImageJong(Model model) {
        // DICOM 이미지의 wadouri URI를 설정
        String dicomImageUri = "wadouri://localhost:8083/dcmfile/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
        //String dicomImageUri = "wadouri://Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
        // DICOM 이미지의 URI를 모델에 추가
        model.addAttribute("dicomImageUri", dicomImageUri);

        return "viewPage"; // JSP 페이지 이름
    }
}

    














