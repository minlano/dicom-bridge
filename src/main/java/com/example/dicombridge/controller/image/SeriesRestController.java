package com.example.dicombridge.controller.image;

import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.service.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/series")
@RequiredArgsConstructor
public class SeriesRestController {

    private final ImageService imageService;

    @GetMapping("/{studyInsUid}")
    public ResponseEntity<List<String>> getSeriesData(@PathVariable String studyInsUid) {
        List<String> series = imageService.getSeriesByStudy(studyInsUid);
        return new ResponseEntity<>(series, HttpStatus.OK);
    }
}
