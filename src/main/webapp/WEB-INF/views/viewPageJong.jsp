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
                </div>
                <div class="contents">
                    <div id="dicomImage"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/cornerstone-core@2.4.0/dist/cornerstone.js"></script>
<script type="text/javascript" src="https://unpkg.com/cornerstone-tools@6.0.0/dist/cornerstoneTools.js"></script>
<script src="https://unpkg.com/cornerstone-wado-image-loader@4.13.2/dist/cornerstoneWADOImageLoader.bundle.min.js"></script>
<%--<script src="https://unpkg.com/cornerstone-core"></script>--%>
<script type="text/javascript" src="https://unpkg.com/cornerstone-core@2.6.1/dist/cornerstone.js"></script>
<script src="https://unpkg.com/cornerstone-wado-image-loader"></script>
<script type="text/javascript" src="https://unpkg.com/dicom-parser@1.7.5/dist/dicomParser.js"></script>
<%--<script src="https://unpkg.com/dicom-parser@1.8.0/dist/dicomParser.js"></script>--%>



<!-- JavaScript 코드를 포함하여 DICOM 이미지를 표시합니다 -->
<script>
    $(document).ready(function() {
        $.ajax({
            url: "/studies/1",
            type: "POST",
            contentType: 'application/json',
            success: function(response) {
                let b2a = new binary2Array(response);

                cornerstoneTools.external.cornerstone = cornerstone;
                let el = document.getElementById('dicomImage');
                el.style.width = '2000px';
                el.style.height = '2000px';
                cornerstone.enable(el);
                cornerstone.displayImage(el, b2a.image);
            },
            error: function() {
                alert("Error Occurred!");
            }
        });

        class binary2Array {
            constructor(response) {
                // response는 byte[] 배열(Base64 인코딩된) dcm파일 1개
                // let val;
                // for(let key in response) val = response[key];

                // let decodedBiData = atob(val);
                // let uint8Array = new Uint16Array(decodedBiData.length);
                let buffer = new ArrayBuffer(response.length);
                let view = new Uint8Array(buffer);

                for (let i = 0; i < response.length; i++) {
                    view[i] = response.charCodeAt(i);
                }
                console.log(view);

                /**********************************************************************/
                // // Canvas 엘리먼트 생성
                // let canvas = document.createElement('canvas');
                // canvas.width = 500;
                // canvas.height = 500;
                // let test = document.getElementById("imageTest");
                // test.appendChild(canvas);
                //
                // // Canvas의 2D 컨텍스트 가져오기
                // let ctx = canvas.getContext('2d');
                //
                // // ImageData 생성
                // let imageData = ctx.createImageData(2108, 2560);
                //
                // // ImageData에 픽셀 데이터 설정
                // for (let i = 0; i < uint8Array.length; i++) {
                //     imageData.data[i] = uint8Array[i];
                // }
                //
                // // Canvas에 ImageData를 그리기
                // ctx.putImageData(imageData, 0, 0);
                /**********************************************************************/

                // var bit8Array = new Uint8Array(binaryData.buffer);
                // const options = { TransferSyntaxUID: '1.2.840.10008.1.2.4.70' };
                var dicomDataSet = dicomParser.parseDicom(view);

                console.log(dicomDataSet.uint16('xfffee000'));

                var studyInstanceUid = dicomDataSet.string('x0020000d');
                var rows = dicomDataSet.uint16('x00280010');
                var cols = dicomDataSet.uint16('x00280011');
                // var windowCenter = dicomDataSet.floatString('x00281050');
                // var windowWidth = dicomDataSet.floatString('x00281051');
                // var minPixelValue = dicomDataSet.uint16('x00280106');
                // var maxPixelValue = dicomDataSet.uint16('x00280107');
                var pixelDataElement = dicomDataSet.elements.x7fe00010;
                var pixelData = new Uint16Array(dicomDataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length);
                console.log("pixelData --> " + pixelData);
                function getPixelData() {
                    return pixelData;
                }
                /***********************************************************/
                this.image = {
                    // imageId: studyInstanceUid,
                    // windowCenter: 50,
                    // windowWidth: 100,
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
                    columnPixelSpacing: 1.0, // 1 pixel to mm
                    rowPixelSpacing: 1.0
                };
            };
        }
    });
</script>

</body>
</html>
