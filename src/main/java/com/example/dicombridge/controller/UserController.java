package com.example.dicombridge.controller;
import org.dcm4che3.io.DicomInputStream;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

@Controller
public class UserController {

    @GetMapping("/showImage")
    public String join(){
        return "/showImage";
    }


    @GetMapping("/showDcm")
    public void showDcm(HttpServletResponse response) throws IOException {
        String filePath = "C:/Users/TJ/Documents/선소현/DCM-Sample4KDT/CT-Abdomen/1.3.12.2.1107.5.1.4.65266.30000018122721584475300010337.dcm";

        try (DicomInputStream dis = new DicomInputStream(new File(filePath));
             OutputStream os = response.getOutputStream()) {
            byte[] buffer = new byte[1024];
            int length;
            while ((length = dis.read(buffer)) != -1) {
                os.write(buffer, 0, length);
            }
        }

        response.setContentType("application/dicom");
        //response.setHeader("Content-Disposition", "inline; filename=yourfile.dcm");
    }


}
