package com.example.dicombridge.controller.image;

import com.example.dicombridge.controller.storage.StorageController;
import com.example.dicombridge.controller.storage.Test;
import com.example.dicombridge.controller.storage.TestController;
import jcifs.smb.SmbFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.dcm4che3.imageio.plugins.dcm.DicomImageReadParam;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.Iterator;

@Controller
@Component
public class ImageControllerMJ {

    @Autowired
    private StorageController storageController;
    @Autowired
    private TestController testController;
    private Test test;
    @Autowired
    public ImageControllerMJ(TestController testController) {
        this.testController = testController;
    }




    @GetMapping("/showDicomImage2")
    public String showDicomImage(Model model) throws IOException {
        // 이미지 파일 경로
        String dicomImagePath = "C:/Users/TJ/Documents/kimminjae/DCM-Sample4KDT/CT-Abdomen/1.3.12.2.1107.5.1.4.65266.30000018122721584475300010337.dcm";
        ImageInputStream imageInputStream = testController.storageConnection();

        try {
            File dicomFile = new File(dicomImagePath);
            // DicomInputStream dis = new DicomInputStream(dicomFile);

            // ImageReader 초기화 및 DICOM 이미지 읽기
            Iterator<ImageReader> readers = ImageIO.getImageReadersByFormatName("DICOM");
            ImageReader imageReader = readers.next();
            ImageInputStream iis = ImageIO.createImageInputStream(dicomFile);
            System.out.println("1="+iis);
            System.out.println("2="+imageInputStream);
            imageReader.setInput(iis);
            //imageReader.setInput(imageInputStream);
            BufferedImage image = imageReader.read(0, new DicomImageReadParam());

            // BufferedImage를 Base64 문자열로 변환
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "jpg", baos);
            byte[] imageBytes = baos.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            // Base64 문자열을 모델에 추가
            model.addAttribute("dicomImageBase64", base64Image);

        } catch (IOException e) {
            // 이미지 파일을 읽는 도중 오류 발생 시 처리
            e.printStackTrace();
        }

        return "showImage";
    }

    @GetMapping("/showDicomImage3")
    public  void showDicomImage(HttpServletResponse response, HttpSession session) throws IOException {

        // 원격 SMB 파일에서 입력 스트림 가져오기
        SmbFile file = testController.storageConnection2();
        InputStream inputStream = file.getInputStream();

        // 입력 스트림에서 바이트 배열로 읽기
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int bytesRead;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            byteArrayOutputStream.write(buffer, 0, bytesRead);
        }

        // 바이트 배열로부터 데이터 얻기
        byte[] fileData = byteArrayOutputStream.toByteArray();

        inputStream.close();
        byteArrayOutputStream.close();
        System.out.println("SMB 파일을 바이트 배열로 읽었습니다.");
        String base64Image = Base64.getEncoder().encodeToString(fileData);

        session.setAttribute("someAttribute", "someValue");

            response.setContentType("image/jpeg");
            response.setContentLength(fileData.length);
            response.getOutputStream().write(fileData);




    }

}
