package com.example.dicombridge.controller.image;

import com.example.dicombridge.service.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

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

    /**  DicomParser 이용하기 위해 byte로 일단 보내기 위한 메서드 **/
    @GetMapping("/{studyKey}")
    public ResponseEntity<Map<String, String>> getImagesData2(@PathVariable String studyKey) throws IOException {
        Map<String, byte[]> dicomDatas = imageService.getImageBytes(Integer.valueOf(studyKey));

        // DICOM 데이터를 Base64로 인코딩
        Map<String, String> res = new HashMap<>();
        for(String dicomData : dicomDatas.keySet()) {
            String base64Encoded = Base64.getEncoder().encodeToString(dicomDatas.get(dicomData));
            res.put(dicomData, base64Encoded);
        }
        return ResponseEntity.ok(res);
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


    /*****************************************************************************************
     ***************리스트에 들어가면 studyinsuid가 전부 동일, studyinsuid가 같은 파일 찾기**********
     ****************리스트에서 클릭시 출력되는 전체 image*****************************************
     *****************************************************************************************/

    @PostMapping("/takeuidgiveseriesnum/{studyinsuid}")
    public ResponseEntity<Map<String, String>> getSeriesNum(@PathVariable String studyinsuid, Model model) throws IOException{
        //List list = imageService.getSeriesNum(studyinsuid);
        //System.out.println(list.size());
        Map<String, String> images = imageService.getSeriesNum(studyinsuid);
        if(!images.isEmpty()) {
            return new ResponseEntity<>(images, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
