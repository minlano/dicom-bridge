package com.example.dicombridge.util;

import jcifs.Address;
import jcifs.CIFSContext;
import jcifs.CIFSException;
import jcifs.config.PropertyConfiguration;
import jcifs.context.BaseContext;
import jcifs.smb.NtlmPasswordAuthenticator;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.net.UnknownHostException;
import java.util.Properties;

@Component
@NoArgsConstructor
public class Storage {
    @Getter
    @Value("${storage.server.username}")
    private String USERNAME;
    @Getter
    @Value("${storage.server.password}")
    private String PASSWORD;
    @Getter
    @Value("${storage.protocol}")
    private String PROTOCOL;
    @Getter
    @Value("${storage.host}")
    private String HOST;
    @Getter
    @Value("${storage.shared-name}")
    private String SHARED_NAME;
    @Getter
    private CIFSContext cifsContext;

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
        } catch (UnknownHostException | CIFSException e) {
            throw new RuntimeException(e);
        }
    }
}
