package com.example.dicombridge.controller.image;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ImageController {

    @GetMapping("/test")
    public String getTestPage() {
        return "test";
    }

    @GetMapping("/viewer/{studyinsuid}")
    public String viewer(@PathVariable String studyinsuid) {
        System.out.println("studyinsuid --> " + studyinsuid);
        return "viewer";
    }

}
