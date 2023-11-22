package com.example.dicombridge.controller.image;

import com.example.dicombridge.domain.dto.study.StudyResponseDto;
import com.example.dicombridge.service.image.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/search-list")
    public List<StudyResponseDto> searchList(
            @RequestParam(name = "pid", required = false) String pid,
            @RequestParam(name = "pname", required = false) String pname,
            @RequestParam(name = "reportstatus", required = false) Integer reportstatus
    ){

        if(pid != null || pname != null || reportstatus != null){
            return studyService.getSearch(pid, pname, reportstatus);
        }
        return studyService.getStudies();
    }

}
