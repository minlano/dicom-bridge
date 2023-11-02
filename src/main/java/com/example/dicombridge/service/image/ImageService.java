package com.example.dicombridge.service.image;

import org.dcm4che3.data.Attributes;
import org.dcm4che3.io.DicomInputStream;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
public class ImageService {

//    public void displayDicomImage() {
//        String dicomFilePath = "C:/Users/TJ/Documents/선소현/DCM-Sample4KDT/CT-Abdomen/1.3.12.2.1107.5.1.4.65266.30000018122721584475300010337.dcm";
//
//        try (DicomInputStream din = new DicomInputStream(new File(dicomFilePath))) {
//            Attributes attributes = din.readFileMetaInformation();
//            int width = attributes.getInt(org.dcm4che3.data.Tag.Columns, 1);
//            int height = attributes.getInt(org.dcm4che3.data.Tag.Rows, 1);
//
//            // 이미지를 100x100 크기로 스케일링
//            if (dicomImage != null) {
//                dicomImage = scaleImage(dicomImage, 100, 100);
//
//                // 스케일링된 이미지를 화면에 출력
//                ImageIO.write(dicomImage, "png", new File("scaled_image.png"));
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//            System.err.println("Error reading DICOM file.");
//            throw new RuntimeException(e);
//        }
//    }

//    private BufferedImage scaleImage(BufferedImage sourceImage, int width, int height) {
//        BufferedImage scaledImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
//        scaledImage.getGraphics().drawImage(sourceImage.getScaledInstance(width, height, java.awt.Image.SCALE_SMOOTH), 0, 0, null);
//        return scaledImage;
//    }

}
