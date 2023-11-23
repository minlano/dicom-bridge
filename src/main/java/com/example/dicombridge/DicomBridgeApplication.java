package com.example.dicombridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class DicomBridgeApplication {
    public static void main(String[] args) {
        SpringApplication.run(DicomBridgeApplication.class, args);
    }

}
