package com.example.dicombridge.controller.storage;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Iterator;

import org.dcm4che3.data.Attributes;
import org.dcm4che3.data.Tag;
import org.dcm4che3.imageio.plugins.dcm.DicomImageReadParam;
import org.dcm4che3.imageio.plugins.dcm.DicomImageReader;
import org.dcm4che3.io.DicomInputStream;
import org.springframework.stereotype.Service;

@Service
public class DicomImageService {

    public  BufferedImage displayDicomImage(String dicomFilePath) {
        //  String newDicomFile ="Z:\\201608\\22\\MS0010\\MR\\5\\MR.1.2.392.200036.9116.4.1.6116.40033.5.3001.1.1152393810.dcm";
       // String dicomFilePath = "Z:\\201608\\22\\MS0010\\MR\\5\\MR.1.2.392.200036.9116.4.1.6116.40033.5.3001.1.1152393810.dcm";


        try (DicomInputStream din = new DicomInputStream(new File(dicomFilePath))) {
            Attributes attributes = din.readFileMetaInformation();
            // DICOM 파일의 메타데이터 출력
            //System.out.println(attributes.toString());
            // DICOM 파일의 픽셀데이터 출력 null일 경우 오류
            byte[] pixelData = attributes.getBytes(Tag.PixelData);
//            System.out.println("PixelData Length: " + pixelData.length);
            // DICOM 파일의 이미지 너비와 높이를 가져오기
            int width = attributes.getInt(Tag.Columns, 1);
            int height = attributes.getInt(Tag.Rows, 1);

            // BufferedImage 객체 생성
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);


            System.out.println("Image Width: " + width);
            System.out.println("Image Height: " + height);

            return image;

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

    }

//    public  BufferedImage displayDicomImage2(String dicomFilePath) throws IOException {
//        try (DicomInputStream din = new DicomInputStream(new File(dicomFilePath))) {
//            Attributes attributes = din.readFileMetaInformation();
//            // DICOM 파일의 메타데이터 출력
//            //System.out.println(attributes.toString());
//            // DICOM 파일의 픽셀데이터 출력 null일 경우 오류
//            byte[] pixelData = attributes.getBytes(Tag.PixelData);
//            int[] pixels = new int[pixelData.length];
//            for (int i = 0; i < pixelData.length; i++) {
//                int grayValue = pixelData[i] & 0xFF; // 8비트 데이터에서 각 픽셀의 밝기 값을 가져옵니다.
//                pixels[i] = (grayValue << 16) | (grayValue << 8) | grayValue; // R, G, B 채널에 같은 값을 설정하여 그레이스케일 이미지로 만듭니다.
//            }
////            System.out.println("PixelData Length: " + pixelData.length);
//            // DICOM 파일의 이미지 너비와 높이를 가져오기
//            int width = attributes.getInt(Tag.Columns, 1);
//            int height = attributes.getInt(Tag.Rows, 1);
//
//            // BufferedImage 객체 생성
//            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
//
//            image.setRGB(0,0,width,height,pixels,0,width);
//
//            System.out.println("Image Width: " + width);
//            System.out.println("Image Height: " + height);
//
//            return image;
//
//        } catch (IOException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }


}






