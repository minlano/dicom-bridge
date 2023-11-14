package com.example.dicombridge.controller.image;

import com.example.dicombridge.service.image.ImageService;
import com.example.dicombridge.service.image.StudyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class StudyController {
    @RequestMapping(method = RequestMethod.GET, path = {"/" , "/index"})
    public String index(){return "index";}

    @GetMapping("/testImageMJ")
    public String testImageMJ(){return "testImageMJ";}

    @GetMapping("/list")
    public String list(){return "list";}

    @Autowired
    private StudyService studyService;
    @GetMapping("/getReportStatus")
    public ResponseEntity<List<Integer>> getReportStatus(@RequestParam int studykey) {
        // 실제 로직 구현
        System.out.println("studykey :" + studykey);
        List<Integer> reportStatusList = studyService.getReportStatusByStudyKey(studykey);

        return new ResponseEntity<>(reportStatusList, HttpStatus.OK);
    }
}
