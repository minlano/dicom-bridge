package com.example.dicombridge.controller.image;

import com.example.dicombridge.domain.dto.thumbnail.ThumbnailWithFileDto;
import com.example.dicombridge.service.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@RestController
@RequestMapping("/studies")
@RequiredArgsConstructor
public class ImageRestController {
    private final ImageService imageService;

    /** Thumbnale **/
    @PostMapping("/getThumbnail/{studyKey}")
    public ResponseEntity<Map<String, ThumbnailWithFileDto>> getThumbnailData(@PathVariable String studyKey) throws IOException {
        Map<String, ThumbnailWithFileDto> images = imageService.getThumbnail(Integer.valueOf(studyKey));

        if (!images.isEmpty()) {
            return new ResponseEntity<>(images, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /** Seriesinsuid Count Check **/
    @GetMapping("/getSeriesInsUidCount/{seriesInsUid}")
    public ResponseEntity<Integer> seriesinsuidCount(@PathVariable String seriesInsUid) throws IOException{
        int count = imageService.seriesinsuidCount(seriesInsUid);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return ResponseEntity.ok().headers(headers).body(count);
    }

    /** Seriesinsuid Image By Count **/
    @GetMapping("/getSeriesInsUidIndex/{seriesInsUid}/{order}")
    public ResponseEntity<byte[]> getSeriesInsUidIndex(@PathVariable String seriesInsUid,
                                                       @PathVariable int order) throws IOException {
        File file = imageService.getFileByseriesinsuidNcount(seriesInsUid, order);

        byte[] data = Files.readAllBytes(file.toPath());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", seriesInsUid + ".jpg");

        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }

    /** Series Count **/
    @PostMapping("/seriescount/{studyinsuid}")
    public int seriesCount(@PathVariable("studyinsuid") String studyinsuid){

        return imageService.findMaxStudyKeyByStudyKey(studyinsuid);
    }

    /** Download **/
    @PostMapping("/download/{studyKey}")
    public ResponseEntity<byte[]> downloadImages(@PathVariable int studyKey) {
        try {
            List<ByteArrayOutputStream> imageStreams = imageService.getFiles(studyKey);
            byte[] zipFileData = imageService.createZipFile(imageStreams, studyKey);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", studyKey + ".zip");

            return new ResponseEntity<>(zipFileData, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /** Seriesinsuids By Studyinsuid **/
    @GetMapping("/getSeriesInsUids/{studyInsUid}")
    public List<String> getSeriesInsUids(@PathVariable String studyInsUid) {
        List<String> images = imageService.getSeriesInsUids(studyInsUid);
        return images;
    }
}
