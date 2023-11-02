<%@ page import="javax.xml.bind.DatatypeConverter" %>
<%@ page import="java.awt.datatransfer.Clipboard" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>DICOM TEST</title>
</head>
<body>
    <h1>DICOM Image</h1>

<%--    <img src="data:image/jpeg;base64,${dicomImage}" alt="DICOM Image" />--%>
    <img src="/showDicomImage" alt="Dicom Image" />

</body>
</html>
