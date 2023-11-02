package com.example.dicombridge.controller.storage;

import com.example.dicombridge.service.image.DicomImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;

@Controller
public class testController {

    @Autowired
    private DicomImageService dicomImageService;
    @GetMapping("/ttest")
    public void syso(HttpServletResponse response){
        //String dicomFilePath = "Z:\\201608\\22\\MS0010\\MR\\9\\MR.1.2.392.200036.9116.4.1.6116.40033.9.1001.8.1152393810.dcm";
        String dicomFilePath = "C:\\Users\\TJ\\Documents\\kimminjae\\DCM-Sample4KDT\\CT-Abdomen\\1.3.12.2.1107.5.1.4.65266.30000018122721584475300010337.dcm";


        BufferedImage image = dicomImageService.displayDicomImage(dicomFilePath);

        if (image != null) {
            try (OutputStream out = response.getOutputStream()) {
                // 이미지를 바이트 배열로 변환하여 JPEG 형식으로 전송
                ImageIO.write(image, "jpeg", out);
            } catch (IOException e) {
                e.printStackTrace();
                System.err.println("catch 발생");
            }
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            System.err.println("image = null");
        }


    }
}
