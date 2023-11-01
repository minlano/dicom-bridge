package com.example.dicombridge.controller.storage;

import com.example.dicombridge.domain.study.Studytab;
import com.example.dicombridge.domain.study.StudytabRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@RequestMapping("/v1/test")
@RequiredArgsConstructor
@RestController
public class storageController {

    @Autowired
    private DicomImageService dicomImageService;

    private final StudytabRepository studytabRepository;

    @GetMapping("/findStudykey/{studykey}")
    //public Studytab getStudyByStudykey(@RequestBody StudytabRequestDto studytabRequestDto){
    public Studytab getStudy(@PathVariable int studykey){
        Studytab studytab = null;
        // int studykey = studytabRequestDto.getStudykey();
        studytab = studytabRepository.findByStudykey(studykey);
        return studytab;

    }

    @GetMapping("/list")
    public List<Studytab> getUserAll() {
        return studytabRepository.findAll();
    }


    /* ***********************************************
     *                  전체 Count
     *********************************************** */

    @GetMapping("/testcount")
    public long getCount(){
        System.out.println(studytabRepository.count());
       return studytabRepository.count();

    }

    /* ***********************************************
     *                 전체 studykey 조회
     *********************************************** */

//    @GetMapping("/findAllstudyKey")
//    public Studytab getAllStudykey() {
//
//        getUserAll().get(0);
//
//        return null;
//
//    }


//dicomImagePath = "Z:/201608/22/MS0010/MR/7/MR.1.2.392.200036.9116.4.1.6116.40033.7.2001.1.1152393810.dcm";
/* ***********************************************
 *                 테스트
 *********************************************** */
@GetMapping("/first")
    public void syso(HttpServletResponse response) throws IOException {
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





}
