package com.example.dicombridge.controller.image;

import com.example.dicombridge.service.image.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class ImageController {

    @GetMapping("/test")
    public String getTestPage() {
        return "test";
    }

    @GetMapping("/viewer/{studyInsUid}/{studyId}")
    public String viewer(@PathVariable String studyInsUid, @PathVariable String studyId, Model model) {
        model.addAttribute("studyInsUid", studyInsUid);
        model.addAttribute("studyId", studyId);
        return "viewer";
    }

    @GetMapping("/testMJ")
    public String testMJ() {
        return "testMJ";
    }

    @GetMapping("/viewPageMJ")
    public String viewPageMJ() {
        return "viewPageMJ";
    }
    @GetMapping("/viewPageMJ3")
    public String viewPageMJ3() {
        return "viewPageMJ3";
    }
    @GetMapping("/viewPageMJ4")
    public String viewPageMJ4() {
        return "viewPageMJ4";
    }

    @Autowired
    private ImageService imageService;
    @GetMapping("/getReportStatus")
    public ResponseEntity<List<String>> getReportStatus(@RequestParam int studykey) {
        // 실제 로직 구현

        List<String> reportStatusList = imageService.getReportStatusByStudyKey(studykey);

        return new ResponseEntity<>(reportStatusList, HttpStatus.OK);
    }


}
