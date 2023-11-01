package com.example.dicombridge.controller;

import com.example.dicombridge.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/v1")
@RequiredArgsConstructor
public class StorageRestController {

    private final ImageService imageService;

    @GetMapping("/images")
    public String getImagesData() throws IOException {
        String pixelDataToJson = imageService.getImages();
        return pixelDataToJson;
    }
}
