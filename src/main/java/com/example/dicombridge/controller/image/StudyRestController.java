package com.example.dicombridge.controller.image;

import com.example.dicombridge.domain.study.StudyResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StudyRestController {

    @GetMapping("/image-list")
    public String studyList() {
        return "haha";
    }
}
