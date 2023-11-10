<%--
  Created by IntelliJ IDEA.
  User: TJ
  Date: 2023-11-10
  Time: 오후 1:06
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <script src="https://unpkg.com/cornerstone-core"></script>
    <script src="https://unpkg.com/cornerstone-wado-image-loader"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="/script/dicomParser.js"></script>
    <script src="/script/exmj.js"></script>
</head>
<body>
<div>
    <a href="#" onclick="viewDicomByStudykey(1)">Convert DCM to Images</a>
    <a href="#" onclick="viewDicomBySeriesinsuid('1.2.392.200036.9116.4.1.6116.40033.7002')">Convert DCM to Images</a>
</div>
<div id="dicomImageContainer"></div>
</body>
</html>
