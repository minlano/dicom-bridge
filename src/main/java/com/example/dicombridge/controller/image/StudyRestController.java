package com.example.dicombridge.controller.image;

import com.example.dicombridge.domain.study.StudyResponseDto;
import com.example.dicombridge.service.image.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class StudyRestController {
    private final StudyService studyService;

    @GetMapping("/study-list")
    public List<StudyResponseDto> studyList() {
        return studyService.getStudies();
    }
}
