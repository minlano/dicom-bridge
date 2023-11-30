package com.example.dicombridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EnableCaching
public class DicomBridgeApplication {
    public static void main(String[] args) {
        SpringApplication.run(DicomBridgeApplication.class, args);
    }

//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/greeting-javaconfig").allowedOrigins("http://localhost:8080", "http://192.168.30.93:8080");
//                registry.addMapping("stuides/**").allowedOrigins("http://localhost:8080", "http://192.168.30.93:8080")
//                        .allowedMethods("GET", "POST")
//                        .allowedHeaders("Origin", "Content-Type", "Accept")
//                        .allowCredentials(true);
//            }
//        };
//    }
}
