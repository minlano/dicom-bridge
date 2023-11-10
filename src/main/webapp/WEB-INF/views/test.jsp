<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
    <title>Title</title>
    <script src="/script/showImage.js"></script>
    <script src="https://unpkg.com/cornerstone-core"></script>
    <script src="https://unpkg.com/cornerstone-wado-image-loader"></script>
    <script src="https://unpkg.com/dicom-parser@1.8.21/dist/dicomParser.js"></script>
    <script src="https://unpkg.com/cornerstone-core"></script>
    <script src="https://unpkg.com/cornerstone-math"></script>
    <script src="https://unpkg.com/cornerstone-tools"></script>
    <script src="https://unpkg.com/cornerstone-wado-image-loader"></script>
</head>
<body>
    <div>
        <a href="#" onclick="showDicomImages('18')">Convert DCM to Images</a>
    </div>
    <div id="imagesContainer"></div>

</body>
</html>
