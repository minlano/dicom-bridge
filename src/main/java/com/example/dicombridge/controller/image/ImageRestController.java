package com.example.dicombridge.controller.image;

import com.example.dicombridge.service.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.dcm4che3.dict.GE_1_2_840_113708_794_1_1_2_0.PrivateTag.MediaType;

@RestController
@RequestMapping("/studies")
@RequiredArgsConstructor
public class ImageRestController {

    private final ImageService imageService;

    @PostMapping("/{studyKey}")
    public ResponseEntity<Map<String, String>> getImagesData(@PathVariable String studyKey) throws IOException {
        Map<String, String> images = imageService.getImages(Integer.valueOf(studyKey));
        if(!images.isEmpty()) {
            return new ResponseEntity<>(images, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}