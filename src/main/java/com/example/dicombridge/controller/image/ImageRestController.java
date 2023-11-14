package com.example.dicombridge.controller.image;

import com.example.dicombridge.domain.common.ThumbnailDto;
import com.example.dicombridge.service.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("/haha/{studyKey}")
    public ResponseEntity<Map<String, String>> getImagesData(@PathVariable String studyKey) throws IOException {
        Map<String, String> images = imageService.getImages(Integer.valueOf(studyKey));
        if(!images.isEmpty()) {
            return new ResponseEntity<>(images, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

//    /**  DicomParser 이용하기 위해 byte로 일단 보내기 위한 메서드 **/
//    @PostMapping("/{studyKey}")
//    public ResponseEntity<byte[]> getImagesData2(@PathVariable String studyKey) throws IOException {
//        Map<String, byte[]> dicomDatas = imageService.getImageBytes(Integer.valueOf(studyKey));
//
//        // DICOM 데이터를 Base64로 인코딩
////        Map<String, String> res = new HashMap<>();
//        byte[] byteArray = null;
//        for(String dicomData : dicomDatas.keySet()) {
////            String base64Encoded = Base64.getEncoder().encodeToString(dicomDatas.get(dicomData));
////            res.put(dicomData, base64Encoded);
//            byteArray = dicomDatas.get(dicomData);
//        }
//        System.out.println(byteArray);
//        return ResponseEntity.ok(byteArray);
//    }
    /**  DicomParser 이용하기 위해 byte로 일단 보내기 위한 메서드 **/

    @PostMapping("/getThumbnail/{studyKey}")
    public ResponseEntity<Map<String, String>> getThumbnailData(@PathVariable String studyKey, Model model) throws IOException {
        Map<String, String> images = imageService.getThumbnail(Integer.valueOf(studyKey));

        if(!images.isEmpty()) {
            return new ResponseEntity<>(images, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

//    @PostMapping("/getThumbnail/{studyKey}")
//    public ResponseEntity<Map<String, ThumbnailDto>> getThumbnailData(@PathVariable String studyKey, Model model) throws IOException {
//        Map<String, ThumbnailDto> images = imageService.getThumbnail(Integer.valueOf(studyKey));
//
//        if(!images.isEmpty()) {
//            return new ResponseEntity<>(images, HttpStatus.OK);
//        }else {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }

    /*****************************************************************************************
     ***************리스트에 들어가면 studyinsuid가 전부 동일, studyinsuid가 같은 파일 찾기**********
     ****************리스트에서 클릭시 출력되는 전체 image*****************************************
     *****************************************************************************************/

    @PostMapping("/takeuidgiveseriesnum/{seriesinsuid}")
    public ResponseEntity<byte[]> getSeriesNum(@PathVariable String seriesinsuid, Model model) throws IOException{
        //List list = imageService.getSeriesNum(studyinsuid);
        //System.out.println(list.size());
       File file = imageService.getSeriesNum(seriesinsuid);
        // 파일을 byte 배열로 읽기
        Path path = file.toPath();
        byte[] data = Files.readAllBytes(path);

        // HTTP 응답 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", seriesinsuid + ".jpg");

        // 파일을 byte 배열로 응답
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }
    @PostMapping("/takeuidgiveseriesnum2/{seriesinsuid}")
    public ResponseEntity<List<byte[]>> getSeriesNum2(@PathVariable String seriesinsuid, Model model) throws IOException{
        List<File> files = imageService.getSeriesNum2(seriesinsuid);

        List<byte[]> byteArrayList = new ArrayList<>();

        for (File file : files) {
            // 각 파일을 byte 배열로 변환합니다.
            Path path = file.toPath();
            byte[] data = Files.readAllBytes(path);

            // byte 배열을 리스트에 추가합니다.
            byteArrayList.add(data);
        }

//        for (File file : files) {
//            Path path = file.toPath();
//            byte[] data = Files.readAllBytes(path);
//            baos.write(data);
//        }
//        System.out.println(baos.toByteArray().toString());
        System.out.println("진입 후 진행중..");
        // HTTP 응답 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        //headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentType(MediaType.APPLICATION_JSON);  // JSON으로 응답합니다.
        headers.setContentDispositionFormData("attachment", seriesinsuid + ".jpg");

        // 파일을 byte 배열로 응답
        return new ResponseEntity<>(byteArrayList, headers, HttpStatus.OK);
    }


    /*****************************************************************************************
     ************************************StudyKey로 조회***************************************
     *****************************************************************************************/
    @PostMapping("/getFile/{studyKey}")
    public ResponseEntity<byte[]> getFile(@PathVariable String studyKey) throws IOException {
        // imageService.getFile 메서드로부터 파일을 읽어들임
        File file = imageService.getFile(Integer.valueOf(studyKey));

        // 파일을 byte 배열로 읽기
        Path path = file.toPath();
        byte[] data = Files.readAllBytes(path);

        //System.out.println(data);
        // HTTP 응답 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", studyKey + ".jpg");

        // 파일을 byte 배열로 응답
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }

    /*****************************************************************************************
     ****************************Seriesinsuid count 조회***************************************
     *****************************************************************************************/
    @PostMapping("/seriesinsuidcount/{seriesinsuid}")
    public ResponseEntity<Integer> seriesinsuidCount(@PathVariable String seriesinsuid) throws IOException{
        int count = imageService.seriesinsuidCount(seriesinsuid);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return ResponseEntity.ok().headers(headers).body(count);
    }

    /*****************************************************************************************
     ****************************Seriesinsuid count 별 이미지***********************************
     *****************************************************************************************/
    @PostMapping("/takeserIesunsuidIndex/{seriesinsuid}/{order}")
    public ResponseEntity<byte[]> takeserIesunsuidIndex(
            @PathVariable String seriesinsuid,@PathVariable int order) throws IOException {
        File file = imageService.getFileByseriesinsuidNcount(seriesinsuid,order);

        // 파일을 byte 배열로 읽기
        Path path = file.toPath();
        byte[] data = Files.readAllBytes(path);

       // System.out.println(data);
        // HTTP 응답 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", seriesinsuid + ".jpg");

        // 파일을 byte 배열로 응답
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }






}
