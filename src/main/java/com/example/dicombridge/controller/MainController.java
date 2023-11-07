package com.example.dicombridge.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainController {

@RequestMapping(method = RequestMethod.GET, path = {"/" , "/index"})
    public String index(){return "index";}


@GetMapping("/testImageMJ")
public String testImageMJ(){return "testImageMJ";}

}
