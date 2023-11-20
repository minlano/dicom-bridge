const axiosInstance = axios.create({
    baseURL: "http://localhost:8080" // 서버의 URL
});

/**
 * Grid Config
 */
var rowCol = {row: 2, col: 2};
var imageContainer = document.getElementById('image-container');

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