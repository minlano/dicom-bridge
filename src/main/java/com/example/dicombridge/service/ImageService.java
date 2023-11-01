package com.example.dicombridge.service;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.dcm4che3.data.Attributes;
import org.dcm4che3.data.Tag;
import org.dcm4che3.io.DicomInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ImageService {

    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);
    private final StorageService storageService;

    public String getImages() throws IOException {
        String projectPath = System.getProperty("user.home") + "\\Desktop";
        String filePath = projectPath + "\\dicom\\DCM-Sample4KDT\\CR-Chest PA\\1.2.410.200013.1.510.1.20210310170346701.0009.dcm";



        logger.info("FilePath : {}", filePath);

        File file = new File(filePath);
        DicomInputStream dis = new DicomInputStream(file);

        // metadata 확인
        Attributes metadata = dis.getFileMetaInformation();
        logger.info("Metadata : {}", metadata.toString());

        // tag 확인
        Attributes dataset = dis.readDataset();
        int[] tags = dataset.tags();
        logger.info("Total tag found in dicom file: {}", tags);
//        for(int tag: tags) {
//            logger.info("VR : {}", dataset.getVR(tag).toString());
//        }

        // pixeldata -> json 변환
        Object pixelData = dataset.getValue(Tag.PixelData);
        Gson gson = new Gson();
        String pixelDataJson = gson.toJson(pixelData);

//        Object sopClassUid = dataset.getValue(Tag.SOPClassUID);
//        Object sopInstanceUid =  dataset.getValue(Tag.SOPInstanceUID);
//        logger.info("SOPClassUID: {}", sopClassUid.toString());
//        logger.info("SOPInstanceUID: {}", sopInstanceUid.toString());

        // dicom 이미지 확인
        return pixelDataJson;
}
