package com.example.dicombridge.service.storage;

import org.springframework.stereotype.Service;
import jcifs.smb.*;

import java.net.MalformedURLException;
import java.net.UnknownHostException;

@Service
public class StorageService {
    private static final String  URL = "";

    private String storageConnection() throws SmbException, MalformedURLException, UnknownHostException {

        jcifs.Config.setProperty("jcifs.netbios.wins", "192.168.30.70");
        NtlmPasswordAuthentication auth = new NtlmPasswordAuthentication("192.168.30.70", "pacsplus", "Sphinx6600");
        //SmbFileInputStream in = new SmbFileInputStream("Z:\\201608\\22\\MS0010\\MR\\5\\MR.1.2.392.200036.9116.4.1.6116.40033.5.3001.1.1152393810.dcm", auth);


        return "hehe";
    }

    public String getImages() {
        return "haha";
    }
}
