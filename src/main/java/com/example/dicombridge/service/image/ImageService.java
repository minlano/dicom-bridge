package com.example.dicombridge.service.image;

import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.repository.ImageRepository;
import jcifs.Address;
import jcifs.CIFSContext;
import jcifs.CIFSException;
import jcifs.config.PropertyConfiguration;
import jcifs.context.BaseContext;
import jcifs.smb.NtlmPasswordAuthenticator;
import jcifs.smb.SmbException;
import jcifs.smb.SmbFile;
import jcifs.smb.SmbFileInputStream;
import org.dcm4che3.tool.dcm2jpg.Dcm2Jpg;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.MalformedURLException;
import java.net.UnknownHostException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ImageService {
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

    public ImageService(ImageRepository imageRepository) {
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

    private Map<String, String> fileRead(Map<String, Image> imageMap) throws IOException {
        Map<String, String> fileMap = new HashMap<>();
        for(String fname : imageMap.keySet()) {
            SmbFileInputStream smbFileInputStream = getSmbFileInputStream(imageMap.get(fname));
            ByteArrayOutputStream byteArrayOutputStream = convert2ByteArrayOutputStream(smbFileInputStream);
            File tempDcmFile = convert2DcmFile(byteArrayOutputStream.toByteArray());
            String dcmByte = convertDcm2Jpg(tempDcmFile);
            fileMap.put(fname, dcmByte);
        }
        return fileMap;
    }

    private SmbFileInputStream getSmbFileInputStream(Image image) throws MalformedURLException, SmbException {
        SmbFile file = new SmbFile(String.join("/", PROTOCOL, HOST, SHARED_NAME, image.getPath().replace('\\', '/') + "/" + image.getFname()), cifsContext);
        return new SmbFileInputStream(file);
    }

    private ByteArrayOutputStream convert2ByteArrayOutputStream(SmbFileInputStream smbFileInputStream) {
        ByteArrayOutputStream byteArrayOutputStream;
        byte[] buffer = new byte[1024*12];
        try {
            byteArrayOutputStream = new ByteArrayOutputStream();

            int bytesRead;
            while ((bytesRead = smbFileInputStream.read(buffer)) != -1) {
                byteArrayOutputStream.write(buffer, 0, bytesRead);
            }
            smbFileInputStream.close();
            byteArrayOutputStream.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return byteArrayOutputStream;
    }

    private File convert2DcmFile(byte[] fileBytes) throws IOException {
        File tempFile = File.createTempFile("tempfile", ".dcm");
        //스토리지에서 cifs로 읽어들인 dicomFile의 temp(로컬에는 저장안되고 메모리에 저장됨)
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(fileBytes);
        }catch (Exception e) {
            System.err.println(e);
        }
        return tempFile;
    }
    public String convertDcm2Jpg(File file) {
        try {
            Dcm2Jpg dcm2Jpg = new Dcm2Jpg();
            BufferedImage image = dcm2Jpg.readImageFromDicomInputStream(file);

            if (image != null) {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(image, "jpg", baos);
                byte[] imageBytes = baos.toByteArray();
                return Base64.getEncoder().encodeToString(imageBytes);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Map<String, byte[]> fileByteRead(Map<String, Image> imageMap) throws SmbException, MalformedURLException {
        Map<String, byte[]> fileByteMap = new HashMap<>();
        for(String fname : imageMap.keySet()) {
            SmbFileInputStream smbFileInputStream = getSmbFileInputStream(imageMap.get(fname));
            ByteArrayOutputStream byteArrayOutputStream = convert2ByteArrayOutputStream(smbFileInputStream);
            fileByteMap.put(fname, byteArrayOutputStream.toByteArray());
        }
        return fileByteMap;
    }

    /**  DicomParser 이용하기 위해 byte로 일단 보내기 위한 메서드 **/
    public Map<String, byte[]> getImageBytes(int studyKey) throws SmbException, MalformedURLException {
        List<Image> images = imageRepository.findByImageIdStudykey(studyKey);
        Map<String, Image> map = images.stream().collect(Collectors.toMap(
                i -> i.getFname(),
                i -> i
        ));
        return fileByteRead(map);
    }

    public Map<String, String> getImages(int studyKey) throws IOException {
        List<Image> images = imageRepository.findByImageIdStudykey(studyKey);
        Map<String, Image> map = images.stream().collect(Collectors.toMap(
                                                            i -> i.getFname(),
                                                            i -> i
                                                        ));
        return fileRead(map);
    }
    /*****************************************************************************************
     ***************studyinsuid를 이용하여 image 조회 및 map에 정보를 담고 fileRead(map)**********
     *****************************************************************************************/
    public Map<String, String> getSeriesNum(String studyinsuid) throws IOException  {
        List<Image> images = imageRepository.findBystudyinsuid(studyinsuid);

        Map<String, Image> map = images.stream().collect(Collectors.toMap(
                i -> i.getFname(),
                i -> i
        ));
        return fileRead(map);
    }

    /* thumbnail */
    public Map<String, String> getThumbnail(int studyKey) throws IOException {
        Map<String, Image> map = new HashMap<>();
        List<Image> images = imageRepository.findByImageIdStudykey(studyKey);

        for (int i = 0; i < images.size(); i++) {
            Image image = images.get(i);
            if (image.getImageId().getImagekey() == 1) {
                map.put(image.getFname(), image);
            }
        }

        return fileRead(map);
    }



}