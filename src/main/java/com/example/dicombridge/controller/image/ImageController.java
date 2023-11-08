package com.example.dicombridge.controller.image;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Controller
public class ImageController {

    @GetMapping("/test")
    public String getTestPage() {
        return "test";
    }
}
