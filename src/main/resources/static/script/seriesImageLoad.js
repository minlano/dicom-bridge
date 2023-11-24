const axiosInstance = axios.create({
    baseURL: "http://localhost:8080" // 서버의 URL
});

/** Grid Config **/
var rowCol = {row: 2, col: 2};
var imageContainer = document.getElementById('image-container');
var infoBox = document.getElementById('infoBox');
var infoContent =  document.getElementById('infoContent');

function showInfoBox() {
    infoBox.style.display = 'inline-block';
}

window.addEventListener('click', function (e) {
    if(e.target.className !== 'info')
        infoBox.style.display = 'none';
})

infoBox.addEventListener(('mousemove'), function(e) {
    var X = e.clientY - infoBox.getBoundingClientRect().top;
    var Y = e.clientX - infoBox.getBoundingClientRect().left;
    imageLayout(X, Y);
})

function imageLayout(X, Y) {
    var boxImg = infoContent.querySelectorAll('ul div img');
    boxImg.forEach(function(img) {
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

infoBox.addEventListener(('click'), function(e) {
    e.stopPropagation();
    infoBox.style.display = 'none';

    imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
    imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
    imageDisplay();
})

/** Series Image Load **/
const FIRST_ORDER = 1;
var seriesCount = localStorage.getItem("seriesCount");
var studyInsUid = localStorage.getItem("studyinsuid");

const studyinsuidKey = JSON.parse(localStorage.getItem("studyinsuidKey"));
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

document.addEventListener("DOMContentLoaded", function() {
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
            div.setAttribute('order', FIRST_ORDER);
            imageContainer.appendChild(div);

            createWheelHandler(id, seriesInsUids[index]);

            if (index < seriesCount) {
                await viewDicomBySeriesInsUid(id, seriesInsUids[index], FIRST_ORDER);
                createBoxHandler(id, seriesInsUids[index]);
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
    try {
        let response = await axiosInstance.get("/studies/getSeriesInsUidIndex/" + seriesInsUid + "/" + order, { responseType: 'arraybuffer' });
        if (response.status === 200)
            await displayDicomImage(response.data, id, seriesInsUid, order);
    } catch (error) {
        console.error(error);
    }
}

/** Cornerstone Image Load **/
async function displayDicomImage(arrayBuffer, divId, seriesInsUid) {
    const imageData = `dicomweb:${URL.createObjectURL(new Blob([arrayBuffer], {type: 'application/dicom'}))}`;
    const existingDiv = document.getElementById(divId);
    existingDiv.style.position = 'relative';

    if (!existingDiv.hasAttribute('data-cornerstone-enabled')) { // 이미 cornerstone이 활성화되었는지 확인
        cornerstone.enable(existingDiv);
        existingDiv.setAttribute('data-cornerstone-enabled', 'true');
    }

    if(existingDiv){
        cornerstone.loadImage(imageData).then(async image => {
            await cornerstone.displayImage(existingDiv, image);
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

function updateMetadata(metadataArray, existingDiv, seriesInsUid) {
    let prevMetadataLeftTop = document.getElementById(`${seriesInsUid}_leftTop`);
    let prevMetadataRightTop = document.getElementById(`${seriesInsUid}_rightTop`);
    let prevMetadataRightBottom = document.getElementById(`${seriesInsUid}_rightBottom`);
    if(prevMetadataLeftTop) prevMetadataLeftTop.remove();
    if(prevMetadataRightTop) prevMetadataRightTop.remove();
    if(prevMetadataRightBottom) prevMetadataRightBottom.remove();

    let parentWidth = existingDiv.offsetWidth;
    let parentHeight = existingDiv.offsetHeight;

    let metadataLeftTop = document.createElement('div');
    metadataLeftTop.id = `${seriesInsUid}_leftTop`;

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
    metadataRightTop.id = `${seriesInsUid}_rightTop`;

    metadataRightTop.style.position = 'absolute';
    metadataRightTop.style.top = '0px';
    // metadataRightTop.style.left = '300px';
    metadataRightTop.style.left = `${parentWidth-300}px`;
    metadataRightTop.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    metadataRightTop.style.color = 'white';
    metadataRightTop.style.padding = '5px';
    metadataRightTop.innerHTML  = metadataArray.rightTop;
    metadataRightTop.style.zIndex = '2';
    metadataRightTop.style.visibility = 'visible';
    existingDiv.appendChild(metadataRightTop);

    let metadataRightBottom = document.createElement('div');
    metadataRightBottom.id = `${seriesInsUid}_rightBottom`;

    metadataRightBottom.style.position = 'absolute';
    metadataRightBottom.style.top = `${parentHeight-50}px`;
    metadataRightBottom.style.left = `${parentWidth-300}px`;
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
    individualDiv.addEventListener('wheel', function(event) {
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

    for(let div of divCollectionByClass) {
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

invertButton.addEventListener('click', function() {
    if(selectedDivById.getAttribute('invert') === 'unchecked') {
        selectedDivById.setAttribute('invert', 'checked');
        invertCheck = true;
    }else {
        selectedDivById.setAttribute('invert', 'unchecked');
        invertCheck = false;
    }
    invertImageWithWWWC(selectedDivById);
});

function invertHandler(divById) {
    selectedDivById = divById;
    var invertVal =  divById.getAttribute('invert');
    if(invertVal === null)
        divById.setAttribute('invert', 'unchecked'); // checked
}

var selectedDivById = '';
function createBoxHandler(id, seriesInsUid) {
    let divById = document.getElementById(id);
    divById.addEventListener('click', function (event) {
        boxHandler(event, divById);
        invertHandler(divById);
        activateFlipRotate(divById);
        activateReset(divById);
    })

    divById.addEventListener('dblclick', function (event) {
        rowCol.row = 1; rowCol.col = 1;
        imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
        imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
        imageDisplayBySeriesInsUid(seriesInsUid);
    })
}

/* Window Level */
const windowLvBtn = document.getElementById('window-level');
const moveBtn = document.getElementById('move');
const playClipBtn = document.getElementById('playClip');
let isPanToolActive = false;
let isWwwcToolActive = false;

windowLvBtn.addEventListener('click', function() {
    windowLevel();
});
moveBtn.addEventListener('click', function() {
    movement_pan();
});

function windowLevel(){
    cornerstoneTools.init();

    const WwwcTool = cornerstoneTools.WwwcTool;

    if (isWwwcToolActive){
        cornerstoneTools.setToolDisabled('Wwwc');
        windowLvBtn.style.backgroundColor ="";
    }else {
        cornerstoneTools.addTool(WwwcTool);
        cornerstoneTools.setToolActive('Wwwc', {mouseButtonMask: 1});
        windowLvBtn.style.backgroundColor ="red";
    }
    isWwwcToolActive = !isWwwcToolActive;
}


function movement_pan(){
    cornerstoneTools.init();
    const PanTool = cornerstoneTools.PanTool;

    if (isPanToolActive) {
        cornerstoneTools.setToolDisabled('Pan');
    }else{
        cornerstoneTools.addTool(PanTool);
        cornerstoneTools.setToolActive('Pan', {mouseButtonMask: 1});
    }
    isPanToolActive = !isPanToolActive;
}


playClipBtn.addEventListener('click', function() {
    playClip();
});

function playClip(){
    cornerstoneTools.init();
    const StackTools = cornerstoneTools.StackTools;

    cornerstoneTools.addTool(StackTools);
    cornerstoneTools.setToolActive('Stack', {mouseButtonMask: 1});

}


/** Comparison **/
var modality = localStorage.getItem("modality");
var pname = localStorage.getItem("pname");
var pid = localStorage.getItem("pid");
var comparison =  document.getElementById('comparison');
let comparisonFalse = true;
comparison.addEventListener(('click'), function(e) {
    alert(comparisonFalse);
    if(comparisonFalse ===false){comparisonFalse=true}
    alert(comparisonFalse);
    //alert(modality);
    $.ajax({
        url: "/comparison-study-list",
        method: "GET",
        data: { modality:modality },
        success: function(response) {
            console.log("기능 입장");
            comparisonList(response);

        },
        error: function() {
            alert("Error Occur!");
        }
    });

    $.ajax({
        url: "/study-list",
        success: function(response) {
            comparisonPrevious(response);
        },
        error: function() {
            alert("Error Occur!");
        }
    });
    openComparisonModal();

})

function comparisonList(response){
    //modal창에 출력
    let comparisonListStr = "";
    for(let i=0; i< response.length; i++){
        comparisonListStr += `<tr class='subTr' data-studyinsuid='${response[i].studyinsuid}' data-studykey='${response[i].studykey}' data-modality='${response[i].modality}'>`;
        comparisonListStr +=     "<td>" + (i+1) + "</td>";
        comparisonListStr +=     "<td class='pid'>" + response[i].pid + "</td>";
        comparisonListStr +=     "<td class='pname'>" + response[i].pname + "</td>";
        comparisonListStr +=     "<td>" + response[i].modality + "</td>";
        comparisonListStr +=     "<td class='studyList'>" + response[i].studydesc + "</td>";
        comparisonListStr +=     "<td>" + response[i].studydate + "</td>";
        comparisonListStr +=     "<td>" + response[i].seriescnt + "</td>";
        comparisonListStr +=     "<td>" + response[i].imagecnt + "</td>";
        comparisonListStr +=     "<td>" + response[i].verifyflag + "</td>";
        comparisonListStr += "</tr>";
    }
    const table = document.getElementById("modalComparisonTable");
    table.insertAdjacentHTML('beforeend', comparisonListStr);
}
function comparisonPrevious(response) {
    let comparisonPreviousListStr = "";
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

//비교검사 라인 클릭.
$(document).on("dblclick", "tr.subTr", function() {
    alert(comparisonFalse);
    comparisonFalse = false;
    // #image-container2의 display: grid, float: right로 변경,
    $("#image-container").css({
        "width": "47%",
        "float" : "left"
    });
    $("#image-container2").css({
        "display": "grid",
        "float" : "right"
    });
    // $("#image-container > *").css({
    //     "width": "50% !important",
    //     "height": "50% !important"
    // });

    $(".cornerstone-canvas").css({
        "width": "100%",
        "height": "100%"
    });

    // 모달 닫기
    var modal = document.getElementById("comparisonModal");
    modal.style.display = "none";
    // 바디 스크롤 허용
    document.body.style.overflow = "auto";
    // #image-container의 width: 47%, float: left로 변경

    // const studyinsuid = $(this).data('studyinsuid');
    // const studykey = $(this).data('studykey');
    // const modality = $(this).data('modality');
    // const pname = $(this).data('pname');
    // const pid = $(this).find('.pid').text();
    // if (studyinsuid && studykey) {
    //     $.ajax({
    //         type: "POST",
    //         url: "/studies/seriescount/" + studyinsuid,
    //         success: function(data) {
    //             var seriesCount = data; // 시리즈 갯수.
    //             //페이지 이동 후
    //             //var seriesCount = localStorage.getItem("seriesCount"); 로 사용
    //
    //             // LocalStorage에 데이터 저장
    //             localStorage.setItem("modality", modality);
    //             localStorage.setItem("seriesCount", seriesCount);
    //             localStorage.setItem("studyinsuid", studyinsuid);
    //             localStorage.setItem("pname", pname);
    //             localStorage.setItem("pid", pid);
    //
    //             // 성공적으로 요청을 받아온 후에 페이지 리디렉션을 수행
    //             window.location.href = "/viewer/" + studyinsuid + "/" + studykey;
    //         },
    //         error: function(xhr, status, error) {
    //             alert("실패 사유: " + xhr.status);
    //         }
    //     });
    // } else {
    //     alert("Data not available");
    // }
});

function handleComparisonTrueChangeEvent() {

}
if (!comparisonFalse) {
    alert(comparisonFalse);
    handleComparisonFalseChangeEvent();
}