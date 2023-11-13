
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <script src="https://unpkg.com/cornerstone-core"></script>
    <script src="https://unpkg.com/cornerstone-wado-image-loader"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="/script/dicomParser.js"></script>
    <script src="/script/mjtest.js"></script>

</head>
<body>
<div id="targetDivId"></div>
<div>
    <a href="#" onclick="viewDicomByStudykey(2)">Convert DCM to Images</a>

    <div class="col-md-6">
        <span>Transfer Syntax: </span><span id="transferSyntax"></span><br>
        <span>SOP Class: </span><span id="sopClass"></span><br>
        <span>Samples Per Pixel: </span><span id="samplesPerPixel"></span><br>
        <span>Photometric Interpretation: </span><span id="photometricInterpretation"></span><br>
        <span>Number Of Frames: </span><span id="numberOfFrames"></span><br>
        <span>Planar Configuration: </span><span id="planarConfiguration"></span><br>
        <span>Rows: </span><span id="rows"></span><br>
        <span>Columns: </span><span id="columns"></span><br>
        <span>Pixel Spacing: </span><span id="pixelSpacing"></span><br>
        <span>Bits Allocated: </span><span id="bitsAllocated"></span><br>
        <span>Bits Stored: </span><span id="bitsStored"></span><br>
        <span>High Bit: </span><span id="highBit"></span><br>
        <span>Pixel Representation: </span><span id="pixelRepresentation"></span><br>
        <span>WindowCenter: </span><span id="windowCenter"></span><br>
        <span>WindowWidth: </span><span id="windowWidth"></span><br>
        <span>RescaleIntercept: </span><span id="rescaleIntercept"></span><br>
        <span>RescaleSlope: </span><span id="rescaleSlope"></span><br>
        <span>Basic Offset Table Entries: </span><span id="basicOffsetTable"></span><br>
        <span>Fragments: </span><span id="fragments"></span><br>
        <span>Min Stored Pixel Value: </span><span id="minStoredPixelValue"></span><br>
        <span>Max Stored Pixel Value: </span><span id="maxStoredPixelValue"></span><br>
        <span>Total Time: </span><span id="totalTime"></span><br>
        <span>Load Time: </span><span id="loadTime"></span><br>
        <span>Decode Time: </span><span id="decodeTime"></span><br>

    </div>

</div>
<div id="dicomImageContainer"></div>

</body>


</html>
