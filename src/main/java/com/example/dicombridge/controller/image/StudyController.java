package com.example.dicombridge.controller.image;

import com.example.dicombridge.domain.dto.study.StudyResponseDto;
import com.example.dicombridge.service.image.StudyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class StudyController {

    @Autowired
    private StudyService studyService;

    @GetMapping("/list")
    public String list(){return "list";}

    @GetMapping("/getReportStatus")
    public ResponseEntity<List<Integer>> getReportStatus(@RequestParam int studykey) {

        List<Integer> reportStatusList = studyService.getReportStatusByStudyKey(studykey);

        return new ResponseEntity<>(reportStatusList, HttpStatus.OK);
    }

    @ResponseBody
    @GetMapping("/getStudies/{studykey}")
    public ResponseEntity<List<StudyResponseDto>> getStudiesByStudyKey(@PathVariable int studykey) {
        List<StudyResponseDto> studies = studyService.getStudiesByStudyKey(studykey);
        if (studies != null && !studies.isEmpty()) {
            return new ResponseEntity<>(studies, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
