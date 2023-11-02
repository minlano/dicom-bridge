package com.example.dicombridge.controller.storage;

import com.example.dicombridge.service.image.ImageService;
import com.example.dicombridge.service.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/v1")
@RequiredArgsConstructor
public class StorageRestController {

    private final ImageService imageService;
    private final StorageService storageService;

    @GetMapping("/images/{studyKey}")
    public String getImagesData(@PathVariable String studyKey) {
        int studykey2 = Integer.valueOf(studyKey);
        return storageService.getImages(studykey2);
    }
}
