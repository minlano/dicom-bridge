package com.example.dicombridge.service.image;

import org.springframework.stereotype.Service;

@Service
public class ImageService {

//    public byte[] getUID(String referencedSOPInstanceUID) throws IOException {
//        // DICOM 파일 경로
//        String dicomFilePath = "C:/Users/TJ/Documents/선소현/DCM-Sample4KDT/CR-Chest PA/1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
//
//        File dicomFile = new File(dicomFilePath);
//
//        Dcm2Jpg dcm2Jpg = new Dcm2Jpg();


//        Attributes attrs = dcm2Jpg.loadDicomObject(dicomFile);
//
//        String sopInstanceUID = attrs.getString(Attributes.Tags.SOPInstanceUID);

//        if (referencedSOPInstanceUID.equals(sopInstanceUID)) {
//            // 참조된 이미지를 찾았을 경우
//
//            BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(dicomFile);
//
//            // 이미지를 JPEG로 변환
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            ImageIO.write(image, "jpeg", baos);
//
//            return baos.toByteArray();
//        }

//        return null; // 참조된 이미지를 찾지 못한 경우 또는 오류 발생시
//    }
}
