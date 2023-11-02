package com.example.dicombridge.controller.storage;

import com.example.dicombridge.service.image.DicomImageService;
import jcifs.CIFSContext;
import jcifs.CIFSException;
import jcifs.config.PropertyConfiguration;
import jcifs.context.BaseContext;
import jcifs.smb.NtlmPasswordAuthenticator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageInputStream;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.MalformedURLException;
import java.util.Properties;

import jcifs.smb.SmbFile;
import jcifs.smb.SmbFileInputStream;


@Controller
@Service
@Component
public class TestController {

    @Autowired
    private DicomImageService dicomImageService;

    @GetMapping("/ttest")
    public void syso(HttpServletResponse response){
        //String dicomFilePath = "Z:\\201608\\22\\MS0010\\MR\\9\\MR.1.2.392.200036.9116.4.1.6116.40033.9.1001.8.1152393810.dcm";
        String dicomFilePath = "C:\\Users\\TJ\\Documents\\kimminjae\\DCM-Sample4KDT\\CT-Abdomen\\1.3.12.2.1107.5.1.4.65266.30000018122721584475300010337.dcm";


        BufferedImage image = dicomImageService.displayDicomImage(dicomFilePath);

        if (image != null) {
            try (OutputStream out = response.getOutputStream()) {
                // 이미지를 바이트 배열로 변환하여 JPEG 형식으로 전송
                ImageIO.write(image, "jpeg", out);
            } catch (IOException e) {
                e.printStackTrace();
                System.err.println("catch 발생");
            }
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            System.err.println("image = null");
        }


    }
    /*********************************************
     *
     ********************************************/
    @GetMapping("/ttestt")
    public  ImageInputStream storageConnection() throws CIFSException {
        String domain = ""; // 도메인 (예: WORKGROUP)
        String username = "pacsplus"; // 사용자 이름
        String password = "Sphinx6600"; // 비밀번호
        String remoteServer = "192.168.30.70"; // 원격 서버 주소
        String sharedFolder = "STS01"; // 공유 폴더 이름
        String path ="201608/22/MS0010/MR/5";
        String fileName = "MR.1.2.392.200036.9116.4.1.6116.40033.5.3001.1.1152393810.dcm"; // 읽어올 파일 이름

        String URL = "smb://"+remoteServer+"/"+sharedFolder+"/"+path+"/"+fileName;
        System.out.println(URL);
        NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(domain, username, password);//NTLM 인증

        Properties properties = new Properties();
        properties.setProperty("jcifs.smb.client.responseTimeout", "5000");
        PropertyConfiguration configuration = new PropertyConfiguration(properties);

        CIFSContext cifsContext = new BaseContext(configuration).withCredentials(auth);


        byte[] buffer = new byte[1024];
        try {
            SmbFile file = new SmbFile(URL, cifsContext); //파일 경로
            SmbFileInputStream smbInputStream = new SmbFileInputStream(file); //파일 읽기 지금은 사용 안함.

            //File localFile = new File("C:\\Users\\TJ\\Documents\\test\\"+fileName); //파일 새로 쓰기 경로 및 이름
            //OutputStream outputStream = new FileOutputStream(localFile); // 파일 새로 만들기
            try(SmbFileInputStream in = new SmbFileInputStream(file)) {
                int bytesRead = 0;
                do {
                    bytesRead = in.read(buffer);
                    System.out.println("bytesRead : " + bytesRead);
                    if(bytesRead >0)
                    //outputStream.write(buffer, 0, bytesRead); //파일 내용 작성
                    if(bytesRead <= 0){
                       // outputStream.close(); //읽을 바이트가 없으면 종료

                    }

                }
                while (bytesRead > 0);

            }
            catch (Exception e) {
                throw new RuntimeException(e);
            }

            // ImageInputStream 생성
            ImageInputStream iis = ImageIO.createImageInputStream(smbInputStream);
            if (iis != null) {
                System.out.println("ImageInputStream created successfully.");
                return iis;
            } else {
                System.out.println("Failed to create ImageInputStream.");
                return null;
            }


        }
        catch (MalformedURLException e) {
            throw new RuntimeException(e);
        } //catch (FileNotFoundException e) {
        catch (IOException e) {
            throw new RuntimeException(e);
        }
        // throw new RuntimeException(e);
       // }

    }
    @GetMapping("/ttestt2")
    public  SmbFile storageConnection2() throws CIFSException {
        String domain = ""; // 도메인 (예: WORKGROUP)
        String username = "pacsplus"; // 사용자 이름
        String password = "Sphinx6600"; // 비밀번호
        String remoteServer = "192.168.30.70"; // 원격 서버 주소
        String sharedFolder = "STS01"; // 공유 폴더 이름
        String path ="201608/22/MS0010/MR/5";
        String fileName = "MR.1.2.392.200036.9116.4.1.6116.40033.5.3001.1.1152393810.dcm"; // 읽어올 파일 이름

        String URL = "smb://"+remoteServer+"/"+sharedFolder+"/"+path+"/"+fileName;
        System.out.println(URL);
        NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(domain, username, password);//NTLM 인증

        Properties properties = new Properties();
        properties.setProperty("jcifs.smb.client.responseTimeout", "5000");
        PropertyConfiguration configuration = new PropertyConfiguration(properties);

        CIFSContext cifsContext = new BaseContext(configuration).withCredentials(auth);


        byte[] buffer = new byte[1024];
        try {
            SmbFile file = new SmbFile(URL, cifsContext); //파일 경로
            SmbFileInputStream smbInputStream = new SmbFileInputStream(file); //파일 읽기 지금은 사용 안함.

            //File localFile = new File("C:\\Users\\TJ\\Documents\\test\\"+fileName); //파일 새로 쓰기 경로 및 이름
            //OutputStream outputStream = new FileOutputStream(localFile); // 파일 새로 만들기
            try(SmbFileInputStream in = new SmbFileInputStream(file)) {
                int bytesRead = 0;
                do {
                    bytesRead = in.read(buffer);
                    System.out.println("bytesRead : " + bytesRead);
                    if(bytesRead >0)
                        //outputStream.write(buffer, 0, bytesRead); //파일 내용 작성
                        if(bytesRead <= 0){
                            // outputStream.close(); //읽을 바이트가 없으면 종료

                        }

                }
                while (bytesRead > 0);

            }
            catch (Exception e) {
                throw new RuntimeException(e);
            }

            return file;

        }

        catch (MalformedURLException e) {
            throw new RuntimeException(e);
        } //catch (FileNotFoundException e) {
        catch (IOException e) {
            throw new RuntimeException(e);
        }
        // throw new RuntimeException(e);
        // }

    }



}
