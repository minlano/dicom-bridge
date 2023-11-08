package com.example.dicombridge.controller.image;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ImageController {

    @GetMapping("/test")
    public String getTestPage() {
        return "test";
    }

    @GetMapping("/testMJ")
    public String getTestMJPage() {return "testMJ"; }
}
