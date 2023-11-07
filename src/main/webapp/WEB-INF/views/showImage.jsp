<%--<%@ page contentType="text/html;charset=UTF-8" language="java" %>--%>
<%--<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>--%>
<%--<html>--%>
<%--<head>--%>
<%--    <title>DICOM TEST</title>--%>
<%--</head>--%>
<%--<body>--%>
<%--    <h1>DICOM Image</h1>--%>

<%--    <c:forEach var="image" items="${images}">--%>

<%--    </c:forEach>--%>

<%--&lt;%&ndash;    <img src="data:image/jpeg;base64,${dicomImage}" alt="DICOM Image">&ndash;%&gt;--%>

<%--&lt;%&ndash;    <img src="/showDicomImage" alt="DICOM Image">&ndash;%&gt;--%>
<%--    <div>--%>
<%--&lt;%&ndash;        <a href="#" onclick="showDicomImages('Z:/201608/22/MS0010/MR/7')">Convert DCM to Images</a>&ndash;%&gt;--%>
<%--        <a href="#" onclick="showDicomImages('4')">Convert DCM to Images</a>--%>
<%--    </div>--%>
<%--    <div id="imagesContainer">--%>
<%--    </div>--%>
<%--    <script>--%>
<%--        function showDicomImages(path) {--%>
<%--            var xhr = new XMLHttpRequest();--%>
<%--            xhr.open("GET", "/studies/" + path, true);--%>
<%--            xhr.onreadystatechange = function () {--%>
<%--                if (xhr.readyState === 4 && xhr.status === 200) {--%>
<%--                    var data = JSON.parse(xhr.responseText);--%>
<%--                    if (data.length > 0) {--%>
<%--                        var imagesContainer = document.getElementById("imagesContainer");--%>
<%--                        imagesContainer.innerHTML = ""; // 이미지 컨테이너 초기화--%>
<%--                        for (var i = 0; i < data.length; i++) {--%>
<%--                            var imageUrl = data[i];--%>
<%--                            var img = document.createElement("img");--%>
<%--                            img.src = imageUrl;--%>
<%--                            imagesContainer.appendChild(img);--%>
<%--                        }--%>
<%--                    } else {--%>
<%--                        alert("No images found.");--%>
<%--                    }--%>
<%--                }--%>
<%--            };--%>
<%--            xhr.send();--%>
<%--        }--%>
<%--    </script>--%>



<%--</body>--%>
<%--</html>--%>
