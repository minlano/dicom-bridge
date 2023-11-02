package com.example.dicombridge.controller.image;

import org.dcm4che3.data.Attributes;

import org.dcm4che3.imageio.plugins.dcm.DicomImageReader;
import org.dcm4che3.imageio.plugins.dcm.DicomImageReaderSpi;

import org.dcm4che3.io.DicomInputStream;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.awt.image.BufferedImage;
import java.io.File;

@Controller
public class DicomImageController {


    @GetMapping("/viewDicomImage")
    public String viewDicomImage(Model model) {
        try {
            String filePath = "/Users/jeonghoonoh/Downloads/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
            File dicomFile = new File(filePath);

            DicomInputStream dis = new DicomInputStream(dicomFile);
            Attributes attrs = dis.readDataset(-1, -1);

            DicomImageReaderSpi spi = new DicomImageReaderSpi();
            ImageInputStream iis = ImageIO.createImageInputStream(dicomFile);
            ImageReader reader = spi.createReaderInstance();
            reader.setInput(iis, false);
            BufferedImage image = reader.read(0);

            model.addAttribute("dicomImage", image);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "dicomImagePage";
    }
}
