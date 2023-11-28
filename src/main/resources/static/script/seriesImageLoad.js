const axiosInstance = axios.create({
    baseURL: "http://localhost:8080" // 서버의 URL
});

/** Grid Config **/
var pastRowCol = {row:2, col:2};
var rowCol = {row: 2, col: 2};
var imageContainer = document.getElementById('image-container');
var imageContainer2 = document.getElementById('image-container2');
var infoBox = document.getElementById('infoBox');
var infoContent = document.getElementById('infoContent');
var seriesInsUids;

let studyinsuidComparison;

function showInfoBox() {
    infoBox.style.display = 'inline-block';
}

window.addEventListener('click', function (e) {
    if (e.target.className !== 'info')
        infoBox.style.display = 'none';
})

infoBox.addEventListener(('mousemove'), function (e) {
    var X = e.clientY - infoBox.getBoundingClientRect().top;
    var Y = e.clientX - infoBox.getBoundingClientRect().left;
    imageLayout(X, Y);
})

function imageLayout(X, Y) {
    var boxImg = infoContent.querySelectorAll('ul div img');
    boxImg.forEach(function (img) {
        img.src = '/images/blank_box.png';
    });

    var boxSize = 22;
    var X_GAP = 3; var Y_GAP = 3;
    var row; var col;
    for(var i= 0; i < 5; i++) {
        if((boxSize * i) + X_GAP < X) row = i + 1;
        if((boxSize * i) + Y_GAP < Y) col = i + 1;
    }

    var ulRow; var divRow;
    for(var i = 0; i < row; i++) {
        ulRow = infoContent.querySelectorAll('ul')[i];
        for(var j = 0; j < col; j++) {
            divRow = ulRow.querySelectorAll('div')[j];
            divRow.querySelector('img').src = '/images/filled_box.png';
        }
    }
    rowCol.col = col; rowCol.row = row;
}

infoBox.addEventListener(('click'), function (e) {
    const isChecked = document.querySelector('#image-container2 .checked');

    if (isChecked) {
        e.stopPropagation();
        infoBox.style.display = 'none';

        imageContainer2.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
        imageContainer2.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
        imageDisplayComparison(studyinsuidComparison);
    } else {
        e.stopPropagation();
        infoBox.style.display = 'none';

        imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
        imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
        imageDisplay();
    }
})

/** Series Image Load **/
const FIRST_ORDER = 1;
const COMPARISON_FIRST_ORDER = 0;
var seriesCount = localStorage.getItem("seriesCount");
var studyInsUid = localStorage.getItem("studyinsuid");

const studyinsuidKey = JSON.parse(localStorage.getItem("studyinsuidKey"));
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

document.addEventListener("DOMContentLoaded", function () {
    imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
    imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
    imageDisplay();
});

async function imageDisplay() {
    while (imageContainer.firstChild)
        imageContainer.removeChild(imageContainer.firstChild);

    var index = 0;
    var seriesInsUids = await findSeriesInsUidByStudyInsUid();
    for (var i = 0; i < rowCol.row; i++) {
        for (var j = 0; j < rowCol.col; j++) {
            var div = document.createElement('div');
            var id = `image_${i}_${j}`;
            div.id = id;
            div.style.height = "100%";
            div.style.maxWidth ="100%";
            div.style.width = "100%";
            div.style.maxHeight ="100%";
            div.setAttribute('order', FIRST_ORDER);
            imageContainer.appendChild(div);
            createWheelHandler(id, seriesInsUids[index]);

            if (index < seriesCount) {
                await viewDicomBySeriesInsUid(id, seriesInsUids[index], FIRST_ORDER);
                createBoxHandler(id, seriesInsUids[index]);
                activateReset(id);
            }
            index++;
        }
    }
}

/** Series Grid 1 **/
async function imageDisplayBySeriesInsUid(seriesInsUid) {
    while (imageContainer.firstChild)
        imageContainer.removeChild(imageContainer.firstChild);

    var div = document.createElement('div');
    var id = `image_0_0`;
    div.id = id;
    div.className = 'checked';
    div.setAttribute('order', FIRST_ORDER);
    imageContainer.appendChild(div);

    createWheelHandler(id, seriesInsUid);
    await viewDicomBySeriesInsUid(id, seriesInsUid, FIRST_ORDER);
    createBoxHandler(id);

    div.addEventListener('dblclick', function(event) {

        imageContainer.style.gridTemplateRows = `repeat(${pastRowCol.row}, 1fr)`;
        imageContainer.style.gridTemplateColumns = `repeat(${pastRowCol.col}, 1fr)`;
        rowCol.row=pastRowCol.row;
        rowCol.col=pastRowCol.col;
        imageDisplay();
    });
}

async function findSeriesInsUidByStudyInsUid() {
    try {
        let response = await axiosInstance.get("/studies/getSeriesInsUids/" + studyInsUid);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
}

async function viewDicomBySeriesInsUid(id, seriesInsUid, order) {
    var wherediv = "first";
    try {
        let response = await axiosInstance.get("/studies/getSeriesInsUidIndex/" + seriesInsUid + "/" + order, {responseType: 'arraybuffer'});
        if (response.status === 200)
            await displayDicomImage(response.data, id, seriesInsUid, order, wherediv);
    } catch (error) {
        console.error(error);
    }
}

/** Cornerstone Image Load **/
async function displayDicomImage(arrayBuffer, divId, seriesInsUid,order, wherediv) {
    var check = wherediv;
    const imageData = `dicomweb:${URL.createObjectURL(new Blob([arrayBuffer], {type: 'application/dicom'}))}`;
    const existingDiv = document.getElementById(divId);
    existingDiv.style.position = 'relative';

    if (!existingDiv.hasAttribute('data-cornerstone-enabled')) { // 이미 cornerstone이 활성화되었는지 확인
        cornerstone.enable(existingDiv);
        existingDiv.setAttribute('data-cornerstone-enabled', 'true');
    }

    if (existingDiv) {
        cornerstone.loadImage(imageData).then(async image => {
            await cornerstone.displayImage(existingDiv, image);
            if(check =="first"){
                await updateMetadata(setMetadata(arrayBuffer), existingDiv, seriesInsUid,wherediv);
            }else{
                await updateMetadata(setMetadata(arrayBuffer), existingDiv, seriesInsUid,wherediv);
            }
            await updateMetadata(setMetadata(arrayBuffer), existingDiv, seriesInsUid);
        });
    } else {
        console.error(`Div with ID '${divId}' not found.`);
    }
}

function setMetadata(arrayBuffer) {
    const byteArray = new Uint8Array(arrayBuffer);
    const dataSet = dicomParser.parseDicom(byteArray);

    const patientID = dataSet.string('x00100020');
    const patientName = dataSet.string('x00100010');
    const patientBirth = dataSet.string('x00100030');
    const seriesNum = dataSet.string('x00200011');
    const instanceNum = dataSet.string('x00200013');
    const seriesDate = dataSet.string('x00080021');
    const seriesTime = dataSet.string('x00080031');
    const manufacturer = dataSet.string('x00080070');
    const manufacturerModel = dataSet.string('x00081090');
    const operatorsName = dataSet.string('x00081070');

    const metadataArray = {
        leftTop: patientName + '<br>' + patientID + '<br>' + patientBirth + '<br>' + seriesNum + '<br>' + instanceNum + '<br>' + seriesDate + '<br>' + seriesTime,
        rightTop: manufacturer + '<br>' + manufacturerModel,
        rightBottom: operatorsName
    };
    return metadataArray;
}

function updateMetadata(metadataArray, existingDiv, seriesInsUid,wherediv) {
    let prevMetadataLeftTop = document.getElementById(wherediv+`${seriesInsUid}_leftTop`);
    let prevMetadataRightTop = document.getElementById(wherediv+`${seriesInsUid}_rightTop`);
    let prevMetadataRightBottom = document.getElementById(wherediv+`${seriesInsUid}_rightBottom`);
    if (prevMetadataLeftTop) prevMetadataLeftTop.remove();
    if (prevMetadataRightTop) prevMetadataRightTop.remove();
    if (prevMetadataRightBottom) prevMetadataRightBottom.remove();

    let metadataLeftTop = document.createElement('div');
    metadataLeftTop.id = wherediv+`${seriesInsUid}_leftTop`;

    metadataLeftTop.style.position = 'absolute';
    metadataLeftTop.style.top = '0px';
    metadataLeftTop.style.left = '0px';
    metadataLeftTop.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    metadataLeftTop.style.color = 'white';
    metadataLeftTop.style.padding = '5px';
    metadataLeftTop.innerHTML = metadataArray.leftTop;
    metadataLeftTop.style.zIndex = '2';
    metadataLeftTop.style.visibility = 'visible';
    existingDiv.appendChild(metadataLeftTop);

    let metadataRightTop = document.createElement('div');
    metadataRightTop.id = wherediv+`${seriesInsUid}_rightTop`;

    metadataRightTop.style.position = 'absolute';
    metadataRightTop.style.top = '0px';
    metadataRightTop.style.right = '0px';
    metadataRightTop.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    metadataRightTop.style.color = 'white';
    metadataRightTop.style.padding = '5px';
    metadataRightTop.innerHTML  = metadataArray.rightTop;
    metadataRightTop.style.zIndex = '2';
    metadataRightTop.style.visibility = 'visible';
    existingDiv.appendChild(metadataRightTop);

    let metadataRightBottom = document.createElement('div');
    metadataRightBottom.id = wherediv+`${seriesInsUid}_rightBottom`;

    metadataRightBottom.style.position = 'absolute';
    metadataRightBottom.style.bottom = '0px';
    metadataRightBottom.style.right = '0px';
    metadataRightBottom.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    metadataRightBottom.style.color = 'white';
    metadataRightBottom.style.padding = '5px';
    metadataRightBottom.innerHTML  = metadataArray.rightBottom;
    metadataRightBottom.style.zIndex = '2';
    metadataRightBottom.style.visibility = 'visible';
    existingDiv.appendChild(metadataRightBottom);
}

function createWheelHandler(id, seriesInsUid) {
    var individualDiv = document.getElementById(id);
    individualDiv.addEventListener('wheel', function (event) {
        handleScroll(event, id, seriesInsUid);
    });
}

async function handleScroll(event, id, seriesInsUid) {
    var individualDiv = document.getElementById(id);
    var order = parseInt(individualDiv.getAttribute('order'), 10) || FIRST_ORDER;
    let maxOrder = await countBySeriesInsUid(seriesInsUid);
    let scrollAmount = event.deltaY > 0 ? -1 : 1;

    order += scrollAmount;
    if (order < FIRST_ORDER || order >= maxOrder)
        order = FIRST_ORDER;

    individualDiv.setAttribute('order', order);
    await viewDicomBySeriesInsUid(id, seriesInsUid, order);
}

async function countBySeriesInsUid(seriesInsUid) {
    try {
        let response = await axiosInstance.get("/studies/getSeriesInsUidCount/" + seriesInsUid);
        if (response.status === 200)
            return response.data;
    } catch (error) {
        console.error(error);
    }
}

function boxHandler(event, divById) {
    let divCollectionByClass = document.getElementsByClassName('checked');

    for (let div of divCollectionByClass) {
        div.style.outline = '';
        div.className = 'unChecked';
    }

    divById.style.outline = '3px solid #00AFEF';
    divById.className = 'checked';
}

/** Cornerstone **/
/* Invert */
var invertButton = document.getElementById('invert');
var invertCheck;

function invertImageWithWWWC(divById) {
    const selectedDiv = cornerstone.getEnabledElement(divById).element;
    var viewport = cornerstone.getViewport(selectedDiv);
    viewport.invert = invertCheck;
    cornerstone.setViewport(selectedDiv, viewport);
}

invertButton.addEventListener('click', function () {
    if (selectedDivById.getAttribute('invert') === 'unchecked') {
        selectedDivById.setAttribute('invert', 'checked');
        invertCheck = true;
    } else {
        selectedDivById.setAttribute('invert', 'unchecked');
        invertCheck = false;
    }
    invertImageWithWWWC(selectedDivById);
});

function invertHandler(divById) {
    selectedDivById = divById;
    var invertVal = divById.getAttribute('invert');
    if (invertVal === null)
        divById.setAttribute('invert', 'unchecked'); // checked
}

var selectedDivById = '';
function createBoxHandler(id, seriesInsUid) {
    let divById = document.getElementById(id);
    divById.addEventListener('click', function (event) {
        boxHandler(event, divById);
        invertHandler(divById);
        activateFlipRotate(divById);
    })

    if (rowCol.row !== 1 || rowCol.col !== 1){
        divById.addEventListener('dblclick', function (event) {
            pastRowCol.col = rowCol.col;
            pastRowCol.row = rowCol.row;
            rowCol.row = 1; rowCol.col = 1;
            imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
            imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
            imageDisplayBySeriesInsUid(seriesInsUid);
        })
    }
}

/* Window Level */
const windowLvBtn = document.getElementById('window-level');
const moveBtn = document.getElementById('move');
let isPanToolActive = false;
let isWwwcToolActive = false;

windowLvBtn.addEventListener('click', function () {
    windowLevel();
});
moveBtn.addEventListener('click', function () {
    movement_pan();
});

function windowLevel() {
    cornerstoneTools.init();

    const WwwcTool = cornerstoneTools.WwwcTool;

    if (isWwwcToolActive) {
        cornerstoneTools.setToolDisabled('Wwwc');
        windowLvBtn.style.backgroundColor = "";
    } else {
        cornerstoneTools.addTool(WwwcTool);
        cornerstoneTools.setToolActive('Wwwc', {mouseButtonMask: 1});
        windowLvBtn.style.backgroundColor = "red";
    }
    isWwwcToolActive = !isWwwcToolActive;
}

function movement_pan() {
    cornerstoneTools.init();
    const PanTool = cornerstoneTools.PanTool;

    if (isPanToolActive) {
        cornerstoneTools.setToolDisabled('Pan');
    } else {
        cornerstoneTools.addTool(PanTool);
        cornerstoneTools.setToolActive('Pan', {mouseButtonMask: 1});
    }
    isPanToolActive = !isPanToolActive;
}

/** Comparison **/
var modality = localStorage.getItem("modality");
var pname = localStorage.getItem("pname");
var pid = localStorage.getItem("pid");
var comparison = document.getElementById('comparison');
let comparisonFalse = true;
comparison.addEventListener(('click'), function (e) {
    if (comparisonFalse === false) {
        return handleComparisonTrueChangeEvent()
    }

    //alert(modality);
    $.ajax({
        url: "/comparison-study-list",
        method: "GET",
        data: {modality: modality},
        success: function (response) {
            comparisonList(response);
        },
        error: function () {
            alert("Error Occur!!");
        }
    });

    $.ajax({
        url: "/study/list",
        success: function (response) {
            comparisonPrevious(response);
        },
        error: function () {
            alert("Error Occur!");
        }
    });
    openComparisonModal();
})

function comparisonList(response) {
    //modal창에 출력
    let comparisonListStr = "";
    comparisonListStr += `
        <tr id="trTitle">
            <th>번호</th>
            <th>환자 아이디</th>
            <th>환자 이름</th>
            <th>검사장비</th>
            <th class="study">검사설명</th>
            <th>검사일시</th>
            <th>시리즈</th>
            <th>이미지</th>
            <th>Verify</th>
        </tr>`;
    for (let i = 0; i < response.length; i++) {
        comparisonListStr += `<tr class='subTr' data-studyinsuid='${response[i].studyinsuid}' data-studykey='${response[i].studykey}' data-modality='${response[i].modality}'>`;
        comparisonListStr += "<td>" + (i + 1) + "</td>";
        comparisonListStr += "<td class='pid'>" + response[i].pid + "</td>";
        comparisonListStr += "<td class='pname'>" + response[i].pname + "</td>";
        comparisonListStr += "<td>" + response[i].modality + "</td>";
        comparisonListStr += "<td class='studyList'>" + response[i].studydesc + "</td>";
        comparisonListStr += "<td>" + response[i].studydate + "</td>";
        comparisonListStr += "<td>" + response[i].seriescnt + "</td>";
        comparisonListStr += "<td>" + response[i].imagecnt + "</td>";
        comparisonListStr += "<td>" + response[i].verifyflag + "</td>";
        comparisonListStr += "</tr>";
    }
    const table = document.getElementById("modalComparisonTable");
    table.innerHTML = "";
    table.insertAdjacentHTML('beforeend', comparisonListStr);
}

function comparisonPrevious(response) {
    let comparisonPreviousListStr = "";
    comparisonPreviousListStr += `
                            <tr>
                                <th>환자이름</th>
                                <th>검사장비</th>
                                <th class="study">검사설명</th>
                                <th>검사일시</th>
                                <th>시리즈</th>
                                <th>이미지</th>
                            </tr>`;
    for (let i = 0; i < response.length; i++) {
        if (pid === response[i].pid) {
            comparisonPreviousListStr += `<tr class='subTr' data-studyinsuid='${response[i].studyinsuid}' data-studykey='${response[i].studykey}'>`;
            comparisonPreviousListStr += "<td>" + pname + "</td>";
            comparisonPreviousListStr += "<td>" + response[i].modality + "</td>";
            comparisonPreviousListStr += "<td>" + response[i].studydesc + "</td>";
            comparisonPreviousListStr += "<td>" + response[i].studydate + "</td>";
            comparisonPreviousListStr += "<td>" + response[i].seriescnt + "</td>";
            comparisonPreviousListStr += "<td>" + response[i].imagecnt + "</td>";
            comparisonPreviousListStr += "</tr>";
        }
    }
    const table = document.getElementById("comparisonPreviousTable");
    table.innerHTML = "";
    table.insertAdjacentHTML('beforeend', comparisonPreviousListStr);
}

function closeComparisonModal() {
    // 모달 닫기
    var modal = document.getElementById("comparisonModal");
    modal.style.display = "none";

    // 바디 스크롤 허용
    document.body.style.overflow = "auto";
}

function openComparisonModal() {
    // 모달 열기
    var comparisonModal = document.getElementById("comparisonModal");
    comparisonModal.style.display = "block";

    // 바디 스크롤 막기
    document.body.style.overflow = "hidden";
}

function ComparisonCss() {

    if (!comparisonFalse) {
        if (isThumbnailVisible) {
            $("#image-container").css({
                "width": "45%",
                "float": "left",
                "overflow": "auto"

            });
            $("#image-container2").css({
                "width": "45%",
                "display": "grid",
                "float": "right"
            });

        } else {
            $("#image-container").css({
                "width": "40%",
                "float": "left",
                "overflow": "auto"
            });
            $("#image-container2").css({
                "width": "40%",
                "display": "grid",
                "float": "right"
            });

        }
    }
}

function ComparisonInnerCss(){
    $(".cornerstone-canvas").css({
        "width": "40%",
    });
}

function ComparisonChange(){
    var index = 0;
    imageDisplay();

    // 모달 닫기
    var modal = document.getElementById("comparisonModal");
    modal.style.display = "none";
    // 바디 스크롤 허용
    document.body.style.overflow = "auto";

    imageContainer2.style.gridTemplateRows = `repeat(2, 1fr)`;
    imageContainer2.style.gridTemplateColumns = `repeat(2, 1fr)`;
    imageDisplayComparison(studyinsuidComparison);

    $(".cornerstone-canvas").css({
        "width": "100%",
        "height": "100%"
    });
}

//비교검사 라인 클릭.
$(document).on("dblclick", "tr.subTr", function () {
    comparisonFalse = false;
    ComparisonCss();
    studyinsuidComparison = $(this).data('studyinsuid');
    ComparisonChange()
});

async function imageDisplayComparison(studyinsuidComparison) {
    while (imageContainer2.firstChild)
        imageContainer2.removeChild(imageContainer2.firstChild);

    var index = 0;
    seriesInsUids = await findSeriesInsUidByStudyInsUidComparison(studyinsuidComparison);
    seriesInsUids.length
    for (var i = 0; i < rowCol.row; i++) {
        for (var j = 0; j < rowCol.col; j++) {
            var div = document.createElement('div');
            var id = `image2_${i}_${j}`;
            div.id = id;
            div.style.height = '100%';
            div.style.width = '100%';

            div.setAttribute('order', FIRST_ORDER);
            imageContainer2.appendChild(div);

            createWheelHandlerComparison(id, seriesInsUids[index]);

            if (index < seriesInsUids.length) {
                await viewDicomBySeriesInsUidComparison(id, seriesInsUids[index], COMPARISON_FIRST_ORDER);
                createBoxHandler(id, seriesInsUids[index]);
            }
            index++;
        }
    }
}

async function findSeriesInsUidByStudyInsUidComparison(studyinsuidComparison) {
    try {
        let response = await axiosInstance.get("/studies/getSeriesInsUidsComparison/" + studyinsuidComparison);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
}

async function viewDicomBySeriesInsUidComparison(id, seriesInsUid, order) {
    var wherediv = "second";
    try {
        let response = await axiosInstance.get("/studies/getSeriesInsUidIndexComparison/" + seriesInsUid + "/" + order, {responseType: 'arraybuffer'});
        if (response.status === 200)
            await displayDicomImage(response.data, id, seriesInsUid, order, wherediv);
    } catch (error) {
        console.error(error);
    }
}

function handleComparisonTrueChangeEvent() {
    $("#image-container").css({
        "width": "",
        "float": ""

    });
    $("#image-container2").css({
        "display": "none",
        "float": "right"
    });
    $(".cornerstone-canvas").css({
        "width": "100%",
        "height": "100%"
    });
    comparisonFalse = true;
    imageDisplay();
}

function createWheelHandlerComparison(id, seriesInsUid) {
    var individualDiv = document.getElementById(id);
    individualDiv.addEventListener('wheel', function (event) {
        handleScrollComparison(event, id, seriesInsUid);
    });
}

async function handleScrollComparison(event, id, seriesInsUid) {
    var individualDiv = document.getElementById(id);
    var order = parseInt(individualDiv.getAttribute('order'), 10) || COMPARISON_FIRST_ORDER;
    let maxOrder = await countBySeriesInsUid(seriesInsUid);
    let scrollAmount = event.deltaY > 0 ? -1 : 1;

    order += scrollAmount;
    if (order < COMPARISON_FIRST_ORDER || order >= maxOrder)
        order = COMPARISON_FIRST_ORDER;

    individualDiv.setAttribute('order', order);
    await viewDicomBySeriesInsUidComparison(id, seriesInsUid, order);
}

let startIndex = 0;
const batchSize = 10;
let totalItems = 0;


$(document).on("click", "#search", function () {

    $('#mainTable tr:gt(0)').remove(); // 첫번째 tr 제외하고 삭제
    $('#previousTable tr:gt(0)').remove();
    startIndex = 0; // 검색 버튼 클릭 시 startIndex 초기화

    const pid = $('#Pid-input').val();
    const pname = $('#Pname-input').val();
    const reportstatus = $('#category').val();

    fetchDataSomehow(pid, pname, reportstatus, startIndex, batchSize);

});

$(document).on("click", "#searchAll", function () {

    $('#mainTable tr:gt(0)').remove(); // 첫번째 tr 제외하고 삭제
    $('#previousTable tr:gt(0)').remove();
    startIndex = 0; // 검색 버튼 클릭 시 startIndex 초기화
    previousItems();

    $('#Pid-input').val('');
    $('#Pname-input').val('');
    $('#category').val('');

    fetchDataSomehow('', '', '', startIndex, batchSize);

});

/** Enter **/
$(document).on("keypress", function (event) {
    if (event.which === 13 || event.keyCode === 13) {
        $('#modalComparisonTable tr:gt(0)').remove(); // 첫번째 tr 제외하고 삭제
        startIndex = 0; // 검색 버튼 클릭 시 startIndex 초기화

        const pid = $('#Pid-input').val();
        const pname = $('#Pname-input').val();
        const reportstatus = $('#category').val();

        fetchDataSomehow(pid, pname, reportstatus, startIndex, batchSize);
    }
});

function fetchDataSomehow(pid, pname, reportstatus, startIndex, batchSize) {
    $.ajax({
        url: "/search/list",
        method: "GET",
        data: {pid: pid, pname: pname, reportstatus: reportstatus, startIndex: startIndex, batchSize: batchSize},
        success: function (response) {
            totalItems = response.length; // 전체 아이템 수
            $('#studyCount').text(totalItems);
            comparisonList(response);
        },
        error: function () {
            alert("Error fetching reportstatus");
        }
    });
}
