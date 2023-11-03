package com.example.dicombridge.controller.image;

import com.example.dicombridge.controller.storage.TestController;
import org.dcm4che3.tool.dcm2jpg.Dcm2Jpg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.RequestDispatcher;

import java.io.IOException;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Base64;

@Controller
@Component
public class ImageControllerMJ  extends HttpServlet {


    @Autowired
    private TestController testController;


    /***************************************************************
     * DICOM FILE(CIFS로 읽어온 temp file) 출력 (단일출력)
     ***************************************************************/
    @GetMapping("/testImageMJ2")
    public void testImageMJ2(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException   {

       //String dicomImagePath = "C:/Users/TJ/Documents/kimminjae/DCM-Sample4KDT/CT-Abdomen/1.3.12.2.1107.5.1.4.65266.30000018122721595823900026233.dcm";
        // File dicomFile = new File(dicomImagePath);
        File tempfile = testController.storageConnection();
        Dcm2Jpg dcm2Jpg = new Dcm2Jpg();
        BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(tempfile);

        // 뷰에 전달할 데이터 설정
        String imageSrc = "data:image/jpeg;base64," + encodeImageToBase64(image);
        request.setAttribute("imageSrc", imageSrc);

        // 뷰로 포워딩
        RequestDispatcher dispatcher = request.getRequestDispatcher("testImageMJ");
        dispatcher.forward(request, response);

    }

    /***************************************************************
     * Base64로 변환
     ***************************************************************/
    private String encodeImageToBase64(BufferedImage image) {
        String base64Image = null;
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "jpg", baos);
            byte[] imageBytes = baos.toByteArray();
            base64Image = Base64.getEncoder().encodeToString(imageBytes);
            baos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return base64Image;
    }

    /***************************************************************
     * DICOM FILE(CIFS로 읽어온 temp file) 출력 (다중출력)
     ***************************************************************/
    @GetMapping("/testImageMJ3")
    public void testImageMJ3(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException   {

        //String dicomImagePath = "C:/Users/TJ/Documents/kimminjae/DCM-Sample4KDT/CT-Abdomen/1.3.12.2.1107.5.1.4.65266.30000018122721595823900026233.dcm";
        // File dicomFile = new File(dicomImagePath);
        File tempfile = testController.storageConnection();
        Dcm2Jpg dcm2Jpg = new Dcm2Jpg();
        BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(tempfile);

        // 뷰에 전달할 데이터 설정
        String imageSrc = "data:image/jpeg;base64," + encodeImageToBase64(image);
        request.setAttribute("imageSrc", imageSrc);

        // 뷰로 포워딩
        RequestDispatcher dispatcher = request.getRequestDispatcher("testImageMJ");
        dispatcher.forward(request, response);

    }

}
