package com.example.dicombridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DicomBridgeApplication {

    public static void main(String[] args) {
       // System.load("/Library/Java/Extensions/opencv_java.dylib");
        SpringApplication.run(DicomBridgeApplication.class, args);
    }

}
