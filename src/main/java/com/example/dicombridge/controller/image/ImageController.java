package com.example.dicombridge.controller.image;

import com.example.dicombridge.service.image.ImageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Controller
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping("/viewer/{studyInsUid}/{studyId}")
    public String viewer(@PathVariable String studyInsUid, @PathVariable String studyId, Model model) {
        model.addAttribute("studyInsUid", studyInsUid);
        model.addAttribute("studyId", studyId);
        return "viewer";
    }
}