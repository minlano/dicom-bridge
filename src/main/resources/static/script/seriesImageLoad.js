const axiosInstance = axios.create({
    baseURL: "http://localhost:8080" // 서버의 URL
});

/**
 * Grid Config
 */
var rowCol = {row: 2, col: 2};
var imageContainer = document.getElementById('image-container');

/**
 * 비교검사 상태
 */
let comparisonFalse = true;

function showBox() {
    document.getElementById('infoBox').style.display = 'inline-block';
}

var infoBox = document.getElementById('infoBox');
infoBox.addEventListener(('mousemove'), function(e) {
    var X = e.clientY - infoBox.getBoundingClientRect().top;
    var Y = e.clientX - infoBox.getBoundingClientRect().left;
    imageLayout(X, Y);
})

var infoContent =  document.getElementById('infoContent');
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
    infoBox.style.display = 'none';

    // 여기다가 화면에 레이아웃 잡고 썸네일 조회 코드 작성
    imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
    imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
    // seriesDisplay2Grid();
    imageDisplay();
})

/**
 * SeriesImageLoad
 */
const FIRST_ORDER = 1;
var seriesCount = localStorage.getItem("seriesCount");
var studyInsUid = localStorage.getItem("studyinsuid");
var modality = localStorage.getItem("modality");
var pname = localStorage.getItem("pname");
var pid = localStorage.getItem("pid");
const studyinsuidKey = JSON.parse(localStorage.getItem("studyinsuidKey"));
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

document.addEventListener("DOMContentLoaded", function() {
    imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
    imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
    imageDisplay();
});

async function imageDisplay() {
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }

    var index = 0;
    var seriesInsUids = await findBySeriesInsUid();
    for(var i=0; i<rowCol.row; i++) {
        for (var j=0; j<rowCol.col; j++) {
            var div = document.createElement('div');

            // div.className = `image ${i} ${j}`;
            var id = `image_${i}_${j}`;
            div.id = id;
            div.setAttribute('order', FIRST_ORDER);
            imageContainer.appendChild(div);

            createWheelHandler(id, seriesInsUids[index]);

            if(index < seriesCount)
                await viewDicomBySeriesInsUid(id, seriesInsUids[index], FIRST_ORDER);
            index++;
        }
    }
}

async function findBySeriesInsUid() {
    try {
        let response = await axiosInstance.get("/series/getSeriesInsUids/" + studyInsUid);
        if (response.status === 200) {
            return response.data; // 배열로 담아있음.
        }
    } catch (error) {
        console.error(error);
    }
}

async function viewDicomBySeriesInsUid(id, seriesInsUid, order) {
    try {
        let response = await axiosInstance.get("/studies/getSeriesInsUidIndex/" + seriesInsUid + "/" + order, { responseType: 'arraybuffer' });
        if (response.status === 200)
            displayDicomImage(response.data, id, seriesInsUid, order);
    } catch (error) {
        console.error(error);
    }
}

function displayDicomImage(arrayBuffer, divId, seriesInsUid, order) { //dicom 이미지 출력
    const imageId = `dicomweb:${URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/dicom' }))}`;
    const existingDiv = document.getElementById(divId);
    // existingDiv.className = seriesInsUid;
    existingDiv.style.position = 'relative';

    // 이미 cornerstone이 활성화되었는지 확인
    if (!existingDiv.hasAttribute('data-cornerstone-enabled')) {
        cornerstone.enable(existingDiv);
        existingDiv.setAttribute('data-cornerstone-enabled', 'true');
    }

    if(existingDiv){
        // cornerstone.enable(existingDiv);
        cornerstone.loadImage(imageId).then(async image => {
            await cornerstone.displayImage(existingDiv, image);

            const byteArray = new Uint8Array(arrayBuffer);
            const dataSet = dicomParser.parseDicom(byteArray);
            const studyDate = dataSet.string('x00080020');
            const patientName = dataSet.string('x00100010');
            const patientID = dataSet.string('x00100020');
            const metadataText = 'Study Date: ' + studyDate + ', Patient Name: ' + patientName + ', Patient ID: ' + patientID;
            await updateMetadata(metadataText, existingDiv, seriesInsUid, order);
        });
    } else {
        console.error(`Div with ID '${divId}' not found.`);
    }
}

// 메타데이터를 업데이트하는 함수
function updateMetadata(metadataText, existingDiv, seriesInsUid, order) {
    let prevMetadataDiv = document.getElementById(`${seriesInsUid}`);
    if(prevMetadataDiv)
        prevMetadataDiv.remove();

    let metadataDiv = document.createElement('div');
    metadataDiv.id = `${seriesInsUid}`;

    metadataDiv.style.position = 'absolute';
    metadataDiv.style.top = '0px';
    metadataDiv.style.left = '0px';
    metadataDiv.style.backgroundColor = 'black';
    metadataDiv.style.color = 'white';
    metadataDiv.style.padding = '5px';
    metadataDiv.textContent = metadataText;
    metadataDiv.style.zIndex = '1000'; // 다른 엘리먼트 위에 표시되도록 함
    // metadataDiv.style.display = 'block';
    metadataDiv.style.visibility = 'visible';
    existingDiv.appendChild(metadataDiv);
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

/*
* 비교검사
 */

var comparison =  document.getElementById('comparison');
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