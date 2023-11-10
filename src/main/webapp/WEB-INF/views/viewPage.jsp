<%@ page import="java.util.Arrays" %>
<%--
  Created by IntelliJ IDEA.
  User: jeonghoonoh
  Date: 11/6/23
  Time: 2:09 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<style>
    #css-01 {
        display: flex;
        flex-direction: column;
    }

    header {
        /*background-color: #333; !* 원하는 배경색 지정 *!*/
        color: #fff; /* 텍스트 색상 지정 */
        padding: 20px;
        text-align: left;
        font-size: 24px;
        /* 길게 가로로 설정 */
    }
    header img{
        width: 300px;

    }
    .container {
        display: flex;
        flex-direction: row; /* 컨테이너 내의 요소들을 가로로 배치 */
        height: 1000px;
    }

    .nav {
        display: flex;
        flex-direction: column;
        background-color: #999; /* 원하는 배경색 지정 */
        width: 200px; /* 원하는 너비 설정 */
        /* 세로로 길게 설정 */
    }
    .nav div {
        margin: 5px; /* 각각의 div 요소 사이의 간격 설정 */
        padding: 10px; /* div 내부 여백 설정 */
        border: 1px solid #333; /* div 테두리 스타일 설정 */
        background-color: #888; /* div 배경색 설정 */
        color: #fff; /* 텍스트 색상 설정 */
    }
    .menuBox {
        padding: 20px;
    }

    .menu {
        background-color: #ccc; /* 원하는 배경색 지정 */
        /* 세로로 길게 설정 */
    }
    .right {
        display: flex;
        flex-direction: column;
        flex: 1; /* right를 가로로 전체 채우기 */
    }
    .tools {
        background-color: #666;
        /* 가로로 길게 설정 */
        display: flex;
        flex-direction: row;
        flex-wrap: wrap; /* 화면 너비를 넘어가면 줄 바꿈 */
    }
    .tools div {
        margin: 5px; /* 각각의 div 요소 사이의 간격 설정 */
        padding: 10px; /* div 내부 여백 설정 */
        border: 1px solid #333; /* div 테두리 스타일 설정 */
        background-color: #888; /* div 배경색 설정 */
        color: #fff; /* 텍스트 색상 설정 */
    }

    .contents {
        background-color: #888; /* 원하는 배경색 지정 */
        /* 넓게 설정 */
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .contents img {
        max-width: 100%;
        max-height: 100%;
    }

</style>
<head>

    <title>Title</title>
</head>
<body>
<div id = "view">
    <div id="css-01">
        <header>
            <img src="resources/images/logo_sample.png" >
        </header>
        <div class="container">
            <div class="nav">
                <div class="menuBox">
                    <div class="admin">
                        Administrator
                    </div>
                    <div class="menu">
                        <div>썸네일</div>
                        <div>툴바</div>
                        <div>리포트</div>
                    </div>
                    <div>
                        setting
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="tools">
                    <div>워크리스트</div>
                    <div>이전</div>
                    <div>다음</div>
                    <div>Default tool</div>
                    <div>윈도우 레벨</div>
                    <div>흑백반전</div>
                    <div>이동</div>
                    <div>스크롤 루프</div>
                    <div>1시리즈</div>
                    <div>비교검사</div>
                    <div>플레이 클립</div>
                    <div>도구</div>
                    <div>주석</div>
                    <div>재설정</div>
                    <div>Series</div>
                    <div>이미지레이아웃</div>
                    <div id="imageTest"></div>
                </div>
                <div class="contents">
                    <div id="dicomImage">
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
<<<<<<< HEAD:src/main/webapp/WEB-INF/views/viewPageJong.jsp
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<%--<script src="https://unpkg.com/cornerstone-core@2.6.1/dist/cornerstone.js"></script>--%>
<script type="text/javascript" src="https://unpkg.com/cornerstone-core@2.4.0/dist/cornerstone.js"></script>
<script type="text/javascript" src="https://unpkg.com/cornerstone-tools@6.0.0/dist/cornerstoneTools.js"></script>
<%--<script src="https://unpkg.com/cornerstone-core"></script>--%>
<script src="https://unpkg.com/cornerstone-wado-image-loader@4.13.2/dist/cornerstoneWADOImageLoader.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dicom-parser@1.8.0/dist/dicomParser.js"></script>
<scirpt src="https://unpkg.com/dicom-parser@1.8.21/dist/dicomParser.js"></scirpt>
<%--<script src="https://unpkg.com/dicom-parser@1.8.21/dist/dicomParser.min.js"></script>--%>

<!-- JavaScript 코드를 포함하여 DICOM 이미지를 표시합니다 -->
<script>
    // DICOM 이미지를 표시할 요소를 가져옵니다
    $(document).ready(function() {
        $.ajax({
            url: "/studies/1",
            type: "GET",
            success: function(response) {
                let b2a = new binary2Array(response);

                cornerstoneTools.external.cornerstone = cornerstone;
                b2a.el.style.width = '2000px';
                b2a.el.style.height = '2000px';
                cornerstone.enable(b2a.el);
                cornerstone.displayImage(b2a.el, b2a.image);
            },
            error: function() {
                alert("Error Occurred!");
            }
        });

        class binary2Array {
            constructor(response) {
                // let img = new Image;
                this.el = document.getElementById('dicomImage');

                let val;
                for(let key in response) {
                    val = response[key];
                }

                var decodedBiData = atob(val);
                var uint8Array = new Uint8Array(decodedBiData.length);
                for (var i = 0; i < decodedBiData.length; i++) {
                    uint8Array[i] = decodedBiData.charCodeAt(i);
                }

                /**********************************************************************/
                // Canvas 엘리먼트 생성
                let canvas = document.createElement('canvas');
                canvas.width = 500;
                canvas.height = 500;
                let test = document.getElementById("imageTest");
                test.appendChild(canvas);

                // Canvas의 2D 컨텍스트 가져오기
                let ctx = canvas.getContext('2d');

                // ImageData 생성
                let imageData = ctx.createImageData(2108, 2560);

                // ImageData에 픽셀 데이터 설정
                for (let i = 0; i < uint8Array.length; i++) {
                    imageData.data[i] = uint8Array[i];
                }

                // Canvas에 ImageData를 그리기
                ctx.putImageData(imageData, 0, 0);
                /**********************************************************************/


                // var bit8Array = new Uint8Array(binaryData.buffer);
                const options = { TransferSyntaxUID: '1.2.840.10008.1.2.4.70' };
                var dicomDataSet = dicomParser.parseDicom(uint8Array, options);
                var studyInstanceUid = dicomDataSet.string('x0020000d');
                var rows = dicomDataSet.uint16('x00280010');
                var cols = dicomDataSet.uint16('x00280011');
                // var windowCenter = dicomDataSet.floatString('x00281050');
                // var windowWidth = dicomDataSet.floatString('x00281051');
                // var minPixelValue = dicomDataSet.uint16('x00280106');
                // var maxPixelValue = dicomDataSet.uint16('x00280107');
                var pixelDataElement = dicomDataSet.elements.x7fe00010;
                var pixelArray = new Uint16Array(dicomDataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length / 2);

                function getPixelData() {
                    return uint8Array;
                }
                /***********************************************************/
                this.image = {
                    imageId: studyInstanceUid,
                    windowCenter: 30,
                    windowWidth: 30,
                    minPixelValue: 0,
                    maxPixelValue: 255,
                    slope: 1.0,
                    intercept: 0,
                    render: cornerstone.renderGrayscaleImage,
                    getPixelData: getPixelData,
                    rows: rows,
                    columns: cols,
                    height: rows,
                    width: cols,
                    color: false,
                    sizeInBytes: cols * rows,
                    columnPixelSpacing: 0.264583333333334, // 1 pixel to mm
                    rowPixelSpacing: 0.264583333333334
                    // columnPixelSpacing: 1.0, // 1 pixel to mm
                    // rowPixelSpacing: 1.0
                };
            };
        }
    });

/*
    // CornerstoneWADOImageLoader를 설정합니다
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
=======
<script src="https://unpkg.com/cornerstone-core"></script>
<script src="https://unpkg.com/cornerstone-wado-image-loader"></script>
<script src="https://unpkg.com/dicom-parser@1.8.0/dist/dicomParser.js"></script>



<!-- JavaScript 코드를 포함하여 DICOM 이미지를 표시합니다 -->
<script>
    loadDICOMImageAndUpdateMetadata();
    // DICOM 이미지와 메타데이터를 로드하고 업데이트하는 함수
    function loadDICOMImageAndUpdateMetadata() {

        // DICOM 이미지를 표시할 요소를 가져옵니다
        const element = document.getElementById('dicomImage');
>>>>>>> #02-OhJeonghoon:src/main/webapp/WEB-INF/views/viewPage.jsp

        // CornerstoneWADOImageLoader를 설정합니다
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

        // DICOM 이미지의 URI를 JSP 모델에서 가져옵니다
        const dicomImageUri = "${dicomImageUri}"; // JSP 모델에서 DICOM 이미지 URI 가져오기
        console.log("dicomImageUri:"+dicomImageUri);
        element.style.width = '100%'; // 원하는 너비 설정
        element.style.height = '500px'; // 원하는 높이 설정

        cornerstone.enable(element);
        cornerstone.loadImage(dicomImageUri).then(image => {
            cornerstone.displayImage(element, image);


            const element = document.getElementById('dicomImage');
            element.style.width = '100%';
            element.style.height = '500px';

            cornerstone.enable(element);
            cornerstone.loadImage(dicomImageUri).then(image => {
                cornerstone.displayImage(element, image);
            // DICOM 이미지 메타데이터를 추출
            const arrayBuffer = image.data.byteArray.buffer;
            const byteArray = new Uint8Array(arrayBuffer);
            const dataSet = dicomParser.parseDicom(byteArray);

            // DICOM 태그에 대한 메타데이터 변수 할당
            const studyDate = dataSet.string('x00080020'); // Study Date
            const patientName = dataSet.string('x00100010'); // Patient Name
            const patientID = dataSet.string('x00100020'); // Patient ID

            // 메타데이터 값을 업데이트
            const metadataText = 'Study Date: ' + studyDate + ', Patient Name: ' + patientName + ', Patient ID: ' + patientID;
            updateMetadata(metadataText, element);

            // 각 메타데이터 항목을 출력
            console.log('Study Date:', studyDate);
            console.log('Patient Name:', patientName);
            console.log('Patient ID:', patientID);

            });
        });
    }
    // 메타데이터를 업데이트하는 함수
    function updateMetadata(metadataText, element) {
        const metadataDiv = document.createElement('div');
        metadataDiv.style.position = 'absolute';
        metadataDiv.style.top = '0px';
        metadataDiv.style.left = '10px';
        metadataDiv.style.backgroundColor = 'black';
        metadataDiv.style.color = 'white';
        metadataDiv.style.padding = '5px';
        metadataDiv.textContent = metadataText;
        metadataDiv.style.zIndex = '1'; // 다른 엘리먼트 위에 표시되도록 함
        metadataDiv.style.display = 'block';
        metadataDiv.style.visibility = 'visible';
        // 이미지 요소의 부모에 메타데이터 요소 추가
        element.parentElement.appendChild(metadataDiv);

<<<<<<< HEAD:src/main/webapp/WEB-INF/views/viewPageJong.jsp
        // 각 메타데이터 항목을 출력
        console.log('Study Date:', studyDate);
        console.log('Patient Name:', patientName);
        console.log('Patient ID:', patientID);
        console.log('Patient Birth Date:', patientBirthDate);
        console.log('Patient Sex:', patientSex);
        console.log('Other Patient IDs:', otherPatientIDs);
        console.log('Patient Age:', patientAge);
        console.log('Patient Comments:', patientComments);
        console.log('Body Part Examined:', bodyPartExamined);
        console.log('KVP:', kvp);
        console.log('Exposure Time:', exposureTime);
        console.log('X-Ray Tube Current:', xRayTubeCurrent);
        console.log('Exposure:', exposure);
        console.log('Radiation Setting:', radiationSetting);
        console.log('Imager Pixel Spacing:', imagerPixelSpacing);
        console.log('View Position:', viewPosition);
        console.log('Study Instance UID:', studyInstanceUID);
        console.log('Series Instance UID:', seriesInstanceUID);
        console.log('Study ID:', studyID);
        console.log('Series Number:', seriesNumber);
    });
*/
=======
    }


>>>>>>> #02-OhJeonghoon:src/main/webapp/WEB-INF/views/viewPage.jsp
</script>

</body>
</html>
