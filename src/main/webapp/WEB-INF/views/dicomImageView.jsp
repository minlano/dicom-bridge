<%--
  Created by IntelliJ IDEA.
  User: jeonghoonoh
  Date: 11/2/23
  Time: 11:08 AM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title>Dicom Image Viewer</title>
</head>
<body>
<h1>Dicom Image Viewer</h1>

<!-- 이미지를 Base64 문자열로 표시 -->
<img src="data:image/jpeg;base64,${dicomImageBase64}" alt="Dicom Image">