package com.example.dicombridge.controller.image;

import com.example.dicombridge.service.image.ReportContentsService;
import com.example.dicombridge.service.image.StudyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class ReportContentsController {

    @Autowired
    private ReportContentsService reportContentsService;

    @GetMapping("/getInterpretation")
    public ResponseEntity<List<String>> getInterpretation(@RequestParam int studykey) {
        // 실제 로직 구현

        List<String> interpretationlist = reportContentsService.getInterpretationByStudyKey(studykey);

        return new ResponseEntity<>(interpretationlist, HttpStatus.OK);
    }
}