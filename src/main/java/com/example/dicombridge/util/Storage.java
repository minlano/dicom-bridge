//package com.example.dicombridge.util;
//
//import com.example.dicombridge.repository.ImageRepository;
//import jcifs.Address;
//import jcifs.CIFSContext;
//import jcifs.CIFSException;
//import jcifs.config.PropertyConfiguration;
//import jcifs.context.BaseContext;
//import jcifs.smb.NtlmPasswordAuthenticator;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import javax.annotation.PostConstruct;
//import java.net.UnknownHostException;
//import java.util.Properties;
//
//@Service
//public class Storage {
//    @Value("${storage.server.username}")
//    private String USERNAME;
//    @Value("${storage.server.password}")
//    private String PASSWORD;
//    @Value("${storage.protocol}")
//    private String PROTOCOL;
//    @Value("${storage.host}")
//    private String HOST;
//    @Value("${storage.shared-name}")
//    private String SHARED_NAME;
//    private ImageRepository imageRepository;
//    private CIFSContext cifsContext;
//
//    public Storage(ImageRepository imageRepository) {
//        this.imageRepository = imageRepository;
//    }
//
//    @PostConstruct
//    private void initialize() {
//        storageConnection();
//    }
//
//    private void storageConnection() {
//        Properties properties = new Properties();
//        properties.setProperty("jcifs.smb.client.responseTimeout", "5000");
//        try {
//            PropertyConfiguration configuration = new PropertyConfiguration(properties);
//            NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(null, USERNAME, PASSWORD);
//            this.cifsContext = new BaseContext(configuration).withCredentials(auth);
//            Address address = cifsContext.getNameServiceClient().getByName(HOST);
//            cifsContext.getTransportPool().logon(cifsContext, address);
//        } catch (UnknownHostException | CIFSException e) {
//            throw new RuntimeException(e);
//        }
//    }
//}
