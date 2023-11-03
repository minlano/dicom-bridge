package com.example.dicombridge.controller.storage;


import jcifs.CIFSContext;
import jcifs.CIFSException;
import jcifs.config.PropertyConfiguration;
import jcifs.context.BaseContext;
import jcifs.context.CIFSContextWrapper;
import jcifs.smb.NtlmPasswordAuthenticator;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.MalformedURLException;
import java.util.Properties;

import jcifs.smb.SmbFile;
import jcifs.smb.SmbFileInputStream;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
@Service
@Component
public class TestController {

    /***************************************************************
     * CIFS에서 파일을 찾아와서(SMB FILE) FILE형식으로 변환
     ***************************************************************/

    public File storageConnection() throws CIFSException {
        String domain = "smb://"; // 도메인 (예: WORKGROUP)
        String username = "pacsplus"; // 사용자 이름
        String password = "Sphinx6600"; // 비밀번호
        String remoteServer = "192.168.30.70"; // 원격 서버 주소
        String sharedFolder = "STS01"; // 공유 폴더 이름
        String path ="201608/22/MS0010/MR/7";
        String fileName = "MR.1.2.392.200036.9116.4.1.6116.40033.7.2001.1.1152393810.dcm"; // 읽어올 파일 이름

        String URL = domain+remoteServer+"/"+sharedFolder+"/"+path+"/"+fileName;
        NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(domain, username, password);//NTLM 인증

        Properties properties = new Properties();
        properties.setProperty("jcifs.smb.client.responseTimeout", "5000");
        PropertyConfiguration configuration = new PropertyConfiguration(properties);

        CIFSContext cifsContext = new BaseContext(configuration).withCredentials(auth);

        byte[] buffer = new byte[1024];
        try {
            SmbFile file = new SmbFile(URL, cifsContext);
            InputStream inputStream = new SmbFileInputStream(file);
            SmbFileInputStream smbInputStream = new SmbFileInputStream(file); //파일 읽기 지금은 사용 안함.

            try {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    byteArrayOutputStream.write(buffer, 0, bytesRead);
                }
                // 스트림 닫기
                inputStream.close();
                byteArrayOutputStream.close();

                // 바이트 배열을 File로 변환 (예시로 로컬에 저장)
                byte[] fileBytes = byteArrayOutputStream.toByteArray();
                File tempFile = File.createTempFile("tempfile", ".dcm");
                //스토리지에서 cifs로 읽어들인 dicomFile의 temp(로컬에는 저장안되고 메모리에 저장됨)
                try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                    fos.write(fileBytes);
                }
                System.out.println("SMB 파일을 File 객체로 변환했습니다.");
                return tempFile;

            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;//없을경우 null을 반환함.
        }
        catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    /***************************************************************
     * CIFS에서 다중파일을 찾아와서(SMB FILE) FILE형식으로 변환
     ***************************************************************/

    @GetMapping("/multicheck")
    public void storageConnection2() throws CIFSException {
        String domain = "smb://"; // 도메인 (예: WORKGROUP)
        String username = "pacsplus"; // 사용자 이름
        String password = "Sphinx6600"; // 비밀번호
        String remoteServer = "192.168.30.70"; // 원격 서버 주소
        String sharedFolder = "STS01"; // 공유 폴더 이름
        String path ="201608/22/MS0010/MR/7";
        String fileName = "MR.1.2.392.200036.9116.4.1.6116.40033.7.2001.1.1152393810.dcm"; // 읽어올 파일 이름

        String URL = domain+remoteServer+"/"+sharedFolder+"/"+path;
        NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(domain, username, password);//NTLM 인증


        byte[] buffer = new byte[1024];


        try {

            Properties properties = new Properties();
            properties.setProperty("jcifs.smb.client.responseTimeout", "5000");
            PropertyConfiguration configuration = new PropertyConfiguration(properties);
            CIFSContext cifsContext = new BaseContext(configuration).withCredentials(auth);
            cifsContext = cifsContext.withCredentials(auth);

            SmbFile smbDirectory = new SmbFile(URL, cifsContext);
            SmbFile[] files = smbDirectory.listFiles(); // 파일과 디렉토리 목록 가져오기

            // 가져온 파일 목록 출력
            for (SmbFile file : files) {
                System.out.println(file.getName());
            }
        } catch (CIFSException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }   
    
}
