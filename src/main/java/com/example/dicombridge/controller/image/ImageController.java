package com.example.dicombridge.controller.image;

import com.example.dicombridge.service.image.ImageService;
import org.dcm4che3.imageio.plugins.dcm.DicomImageReadParam;
import org.dcm4che3.tool.dcm2jpg.Dcm2Jpg;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.imageio.ImageIO;
import javax.imageio.ImageReadParam;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.Iterator;

@Controller
public class ImageController {


    @GetMapping("/showDicomImage")
    public String showDicomImage(HttpServletResponse response) {
        // 이미지 파일 경로
        String dicomImagePath = "C:/Users/TJ/Documents/선소현/DCM-Sample4KDT/CT-Abdomen/1.3.12.2.1107.5.1.4.65266.30000018122721584475300010337.dcm";

        try {
            File dicomFile = new File(dicomImagePath);

            Dcm2Jpg dcm2Jpg = new Dcm2Jpg();

            BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(dicomFile);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "jpeg", baos);

            //이미지데이터를 바이트 배열로 복사해 imageBytes 변수에 저장
            byte[] imageData  = baos.toByteArray();

            //String base64Image = Base64.getEncoder().encodeToString(imageData);
            //model.addAttribute("dicomImage", base64Image);

            //이미지 전송
            response.setContentType("image/jpeg");
            response.setContentLength(imageData.length);
            response.getOutputStream().write(imageData);

        } catch (IOException e) {
            e.printStackTrace();
        }

        return "showImage";
    }


//    @GetMapping("/showDicomImage")
//    public ResponseEntity<byte[]> showDicomImage(@RequestParam("referencedSOPInstanceUID") String referencedSOPInstanceUID) {
//        try {
//            byte[] imageData = ImageService.getUID(referencedSOPInstanceUID);
//
//            if (imageData != null) {
//                HttpHeaders headers = new HttpHeaders();
//                headers.setContentType(MediaType.IMAGE_JPEG);
//                return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
//            } else {
//                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 이미지를 찾지 못한 경우
//            }
//        } catch (IOException e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 오류 발생시
//        }
//    }




}
