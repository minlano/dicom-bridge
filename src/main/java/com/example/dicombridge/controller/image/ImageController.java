package com.example.dicombridge.controller.image;

import com.example.dicombridge.service.image.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ImageController {

    @Autowired
    private ImageService imageService;

//    @GetMapping("/dicomImageDimensions")
//    public String getDicomImageDimensions() {
//        imageService.displayDicomImage(); // ImageService를 통해 이미지 정보를 출력
//        return "DICOM image information retrieved and displayed.";
//    }




//   @GetMapping("/displayImage")
//    public void displayImage(HttpServletResponse response){
//
//       try {
//           String dicomFilePath = "C:/Users/TJ/Documents/선소현/DCM-Sample4KDT/CT-Abdomen/1.3.12.2.1107.5.1.4.65266.30000018122721584475300010337.dcm";
//
//           byte[] imageBytes = getImageData(dicomFilePath);
//
//
//           response.setContentType("image/jpeg"); // 이미지 타입을 JPEG로 설정 (필요에 따라 수정)
//           ServletOutputStream outputStream = response.getOutputStream();
//           outputStream.write(imageBytes);
//
//
//           // 이미지 데이터를 Base64로 인코딩
//           //String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//
//           // HTML 이미지 태그 생성
//           /*String imageTag = "<img src='data:image/jpeg;base64," + base64Image + "' alt='DICOM Image'>";*/
//
//           //return imageTag;
//
//       }catch (IOException e){
//           e.printStackTrace();
//       }
//   }
//
//
//    private byte[] getImageData(String dicomFilePath) throws IOException {
//        File dicomFile = new File(dicomFilePath);
//
//        try (DicomInputStream dis = new DicomInputStream(new FileInputStream(dicomFile))) {
//
//            Attributes attributes = dis.readDataset(-1, -1);
//
//            return attributes.getBytes(0x7FE00010); // 0x7FE00010은 PixelData 태그
//        }
//    }




}
