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
        let response = await axiosInstance.get("http://192.168.30.93:8080/studies/getSeriesInsUids/" + studyInsUid);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
}

async function viewDicomBySeriesInsUid(id, seriesInsUid, order) {
    let whereDiv = 1;
    try {
        let response = await axiosInstance.get("http://192.168.30.93:8080/studies/getSeriesInsUidIndex/" + seriesInsUid + "/" + order, {responseType: 'arraybuffer'});
        if (response.status === 200)
            await displayDicomImage(response.data, id, seriesInsUid, order, whereDiv);
    } catch (error) {
        console.error(error);
    }
}

/** Cornerstone Image Load **/
async function displayDicomImage(arrayBuffer, divId, seriesInsUid, whereDiv) {
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
            await updateMetadata(setMetadata(arrayBuffer), existingDiv, seriesInsUid, whereDiv);
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

function updateMetadata(metadataArray, existingDiv, seriesInsUid, whereDiv) {
    // let prevMetadataLeftTop = document.getElementById(`${seriesInsUid}_leftTop`+whereDiv);
    // let prevMetadataRightTop = document.getElementById(`${seriesInsUid}_rightTop`+whereDiv);
    // let prevMetadataRightBottom = document.getElementById(`${seriesInsUid}_rightBottom`+whereDiv);
    let prevMetadataLeftTop = document.getElementById(`${seriesInsUid}_leftTop`);
    let prevMetadataRightTop = document.getElementById(`${seriesInsUid}_rightTop`);
    let prevMetadataRightBottom = document.getElementById(`${seriesInsUid}_rightBottom`);
    if (prevMetadataLeftTop) prevMetadataLeftTop.remove();
    if (prevMetadataRightTop) prevMetadataRightTop.remove();
    if (prevMetadataRightBottom) prevMetadataRightBottom.remove();

    let metadataLeftTop = document.createElement('div');
    // metadataLeftTop.id = `${seriesInsUid}_leftTop`+whereDiv;
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
    // metadataRightTop.id = `${seriesInsUid}_rightTop`+whereDiv;
    metadataRightTop.id = `${seriesInsUid}_rightTop`;

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
    // metadataRightBottom.id = `${seriesInsUid}_rightBottom`+whereDiv;
    metadataRightBottom.id = `${seriesInsUid}_rightBottom`;

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
        let response = await axiosInstance.get("http://192.168.30.86:8080/studies/getSeriesInsUidCount/" + seriesInsUid);
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