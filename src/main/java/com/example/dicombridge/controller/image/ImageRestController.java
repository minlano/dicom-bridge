package com.example.dicombridge.controller.image;

import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.service.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.dcm4che3.tool.dcm2jpg.Dcm2Jpg;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/studies")
@RequiredArgsConstructor
public class ImageRestController {

    private final ImageService imageService;

    @PostMapping("/{studyKey}")
    public ResponseEntity<Map<String, String>> getImagesData(@PathVariable String studyKey, Model model) throws IOException {
        Map<String, String> images = imageService.getImages(Integer.valueOf(studyKey));
        if(!images.isEmpty()) {
            return new ResponseEntity<>(images, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/getThumbnail/{studyKey}")
    public ResponseEntity<Map<String, String>> getThumbnailData(@PathVariable String studyKey, Model model) throws IOException {
        Map<String, String> images = imageService.getThumbnail(Integer.valueOf(studyKey));

        if(!images.isEmpty()) {
            return new ResponseEntity<>(images, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
