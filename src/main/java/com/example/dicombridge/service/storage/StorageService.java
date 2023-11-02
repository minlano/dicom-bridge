package com.example.dicombridge.service.storage;

import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.repository.ImageRepository;
import jcifs.Address;
import jcifs.CIFSContext;
import jcifs.CIFSException;
import jcifs.config.PropertyConfiguration;
import jcifs.context.BaseContext;
import jcifs.smb.NtlmPasswordAuthenticator;
import jcifs.smb.SmbFile;
import jcifs.smb.SmbFileInputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.net.MalformedURLException;
import java.net.UnknownHostException;
import java.util.List;
import java.util.Properties;

@Service
public class StorageService {
//    private static final String URL = "smb://192.168.30.70/STS01/201608/22/MS0010/MR/5/MR.1.2.392.200036.9116.4.1.6116.40033.5.3001.1.1152393810.dcm";

    @Value("${storage.server.username}")
    private String USERNAME;
    @Value("${storage.server.password}")
    private String PASSWORD;
    @Value("${storage.protocol}")
    private String PROTOCOL;
    @Value("${storage.host}")
    private String HOST;
    @Value("${storage.shared-name}")
    private String SHARED_NAME;
    private ImageRepository imageRepository;
    private CIFSContext cifsContext;

    public StorageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @PostConstruct
    private void initialize() {
        storageConnection();
    }

    private void storageConnection() {
        Properties properties = new Properties();
        properties.setProperty("jcifs.smb.client.responseTimeout", "5000");
        try {
            PropertyConfiguration configuration = new PropertyConfiguration(properties);
            NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(null, USERNAME, PASSWORD);
            this.cifsContext = new BaseContext(configuration).withCredentials(auth);
            Address address = cifsContext.getNameServiceClient().getByName(HOST);
            cifsContext.getTransportPool().logon(cifsContext, address);
        }
        catch (UnknownHostException | CIFSException e) {
            throw new RuntimeException(e);
        }
    }

    private String fileRead(List<Image> images) {
        for(Image image : images) {
            byte[] buffer = new byte[1024*12];

            SmbFile file;
            try {
                file = new SmbFile(String.join("/", PROTOCOL, HOST, SHARED_NAME, image.getPath().replace('\\', '/') + "/" + image.getFname()), cifsContext);
            }
            catch (MalformedURLException e) {
                throw new RuntimeException(e);
            }

            try(SmbFileInputStream in = new SmbFileInputStream(file)) {
                int bytesRead = 0;
                do {
                    bytesRead = in.read(buffer);
                    System.out.println(bytesRead);
                    // FileInputStream 담기
                    // dcm 형식 변환? or buffer 상태 그대로는 안 될 것 같은데
                }
                while (bytesRead > 0);
            }
            catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return "hehe";
    }

    public String getImages(int studyKey) {
        List<Image> images = imageRepository.findByImageIdStudykey(studyKey);
        return fileRead(images);
    }
}
