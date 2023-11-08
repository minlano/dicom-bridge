package com.example.dicombridge.controller.image;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class StudyController {
    @RequestMapping(method = RequestMethod.GET, path = {"/" , "/index"})
    public String index(){return "index";}

    @GetMapping("/testImageMJ")
    public String testImageMJ(){return "testImageMJ";}

    @GetMapping("/list")
    public String list(){return "list";}
}
