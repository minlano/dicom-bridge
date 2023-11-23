package com.example.dicombridge.controller.image;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ImageControllerMJ {

    @GetMapping("/viewDicomImageMJ")
    public String viewDicomImage(Model model) {
        // DICOM 이미지의 wadouri URI를 설정
        String dicomImageUri = "wadouri://localhost:8083/dicom-images/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
        //String dicomImageUri = "wadouri://Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
        // DICOM 이미지의 URI를 모델에 추가
        model.addAttribute("dicomImageUri", dicomImageUri);

        return "viewPageMJ"; // JSP 페이지 이름
    }
}
