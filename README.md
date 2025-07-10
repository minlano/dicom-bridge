# 목차
1. [Dicom-Bridge 프로젝트 개요](#Dicom-Bridge-프로젝트-개요)
2. [담당 페이지 및 기능](#담당-페이지-및-기능)
3. [아키텍처](#아키텍처)
4. [💡 느낀점](#💡-느낀점)  
<br/><br/>

# Dicom-Bridge 프로젝트 개요
의료용 디지털 영상 및 통신 표준인 DICOM을 활용해 DCM 파일로 저장되는 의학영상촬영 이미지를 의사들이 확인할 수 있는 웹뷰어 서비스입니다. 
백엔드 측면에서는 이미지 변환에서의 효율성 향상과 캐싱처리에 중점을 두었습니다. 

<br/>

# 담당 페이지 및 기능
- ### 이미지 추출 및 로딩
  ![이미지_추출_로딩](https://github.com/jonghechoi/dicom-bridge/assets/57426066/e98c5793-daef-41e8-a083-e740d0af8238)

- ### Grid 설정
  #### Grid(가로x세로) 크기를 설정하여 이미지를 확인할 수 있습니다.
  ![레이아웃_변경0](https://github.com/jonghechoi/dicom-bridge/assets/57426066/70c41007-66ef-4997-bcce-a7ac1b149ad4)
  ![레이아웃_변경1](https://github.com/jonghechoi/dicom-bridge/assets/57426066/ad692006-641c-4180-8076-80c0aa87dbe7)

- ### 이미지 스크롤
  ![이미지_스크롤](https://github.com/jonghechoi/dicom-bridge/assets/57426066/b2eac735-7f3b-4210-bad5-b312f39d80fc)

<br/>

# 아키텍처
![Architecture](https://github.com/jonghechoi/dicom-bridge/assets/57426066/543038fe-bdc0-416a-8d91-d73d33326621)

<br/>

# 💡 느낀점
  1. 코드 중복을 줄이고 유연성&재사용성을 높이기 위해 제네릭을 도입했습니다. 그리고 이미지 추출&변환 레이어를 기존 1-layer에서 3-layer로 계층화 했습니다. 이런 과정들에서 새로운 것들을 배우고 많은 고민을 할 수 있어 좋았습니다.
  2. 라이브러리 조사부터 이미지 추출 및 로딩까지 팀원들과의 협업이 없었으면 불가능했을 것 같습니다.
