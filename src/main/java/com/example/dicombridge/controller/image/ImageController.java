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

    @GetMapping("/viewer")
    public String viewer() {
        return "viewer";
    }
    @GetMapping("/testMJ")
    public String testMJ() {
        return "testMJ";
    }
    @GetMapping("/viewPageMJ")
    public String viewPageMJ() {
        return "viewPageMJ";
    }
    @GetMapping("/viewPageMJ3")
    public String viewPageMJ3() {
        return "viewPageMJ3";
    }
    @GetMapping("/viewPageMJ4")
    public String viewPageMJ4() {
        return "viewPageMJ4";
    }



}
