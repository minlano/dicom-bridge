const axiosInstance = axios.create({
    baseURL: "http://localhost:8080" // 서버의 URL
});

// seriesCount
var seriesCount = localStorage.getItem("seriesCount");
var studyinsuid = localStorage.getItem("studyinsuid");

// 스크롤 최대값 설정
let order = 1;
var rowCol = {row: 2, col: 2};
var imageContainer = document.getElementById('image-container');


/**
 * Grid Config
 */
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
        if((boxSize * i) + X_GAP < X) { row = i + 1; }
        if((boxSize * i) + Y_GAP < Y) { col = i + 1; }
    }

    var ulRow; var divRow;
    for(var i = 0; i < row; i++) {
        ulRow = infoContent.querySelectorAll('ul')[i];
        for(var j = 0; j < col; j++) {
            divRow = ulRow.querySelectorAll('div')[j];
            var targetImg = divRow.querySelector('img');
            targetImg.src = '/images/filled_box.png';
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
document.addEventListener("DOMContentLoaded", function() {
    // 페이지가 로딩되면 실행될 코드
    // 마우스 스크롤 이벤트 나중에 호버+@하면서 추가할 것
    // document.body.addEventListener("wheel", handleScroll);
    // countBySeriesinsuid 함수 호출

    imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
    imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
    imageDisplay();
    // seriesDisplay2Grid();
});


function seriesDisplay2Grid() {
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }
    var check = 0;
    for(var i = 0; i < rowCol.row; i++) {
        for (var j = 0; j < rowCol.col; j++) {
            var div = document.createElement('div');
            div.className = `image ${i} ${j}`;
            // div.addEventListener('wheel', handleScroll);
            imageContainer.appendChild(div);
            check++;
        }
    }
    console.log(check);
}

async function imageDisplay() {
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }

    var index = 0;
    for(var i = 0; i<rowCol.row; i++) {
        for (var j = 0; j < rowCol.col; j++) {
            var div = document.createElement('div');
            // var img = document.createElement('img');

            div.className = `image ${i} ${j}`;
            // div.addEventListener('wheel', handleScroll);
            var id = `image_${i}_${j}`;
            div.id = id;
            div.setAttribute('data-div-id', id); // data-div-id 속성에 id 값을 저장
            imageContainer.appendChild(div);
            if(seriesCount>index){
                viewDicomBySeriesinsuidnthrow(id, index);
            }
            index ++;
        }
    }
}

async function viewDicomBySeriesinsuidnthrow(id, index) {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    const seriesinsuid = await findBySeriesinsuid();
    let tempseriesinsuid = seriesinsuid[index];
    console.log(tempseriesinsuid);
    try {
        let response = await axios.post("/studies/takeserIesunsuidIndex/" + tempseriesinsuid + "/" + order, {
            order: order
        }, {
            responseType: 'arraybuffer'
        });
        if (response.status === 200) {
            let arrayBuffer = response.data;
            displayDicomImagenthrow(arrayBuffer, id);
        }
    } catch (error) {
        console.error(error);
    }
}

async function findBySeriesinsuid() {
    try {
        let response = await axiosInstance.post("/studies/getseriesinsuid/" + studyinsuid + "/" + seriesCount, {
            seriesCount: seriesCount
        });
        if (response.status === 200) {
            return response.data; // 배열로 담아있음.
        }
    } catch (error) {
        console.error(error);
    }
}

function displayDicomImagenthrow(arrayBuffer, divId) { //dicom 이미지 출력

    const imageId = `dicomweb:${URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/dicom' }))}`;
    const existingDiv = document.getElementById(divId);

    if(existingDiv){
        existingDiv.innerHTML = ''; // div 내용을 비워줍니다.
        cornerstone.enable(existingDiv);
        cornerstone.loadImage(imageId).then(image => {
            cornerstone.displayImage(existingDiv, image);
        });
    } else {
        console.error(`Div with ID '${divId}' not found.`);
    }
}

async function handleScroll(event) {
    let maxOrder = await countBySeriesinsuid(seriesinsuid[1])

    console.log(order + "/" + maxOrder);
    if (event.deltaY > 0) {
        // 스크롤을 아래로 내리면 count를 감소시킴
        if (order > 0) {
            order--;
        } else {
            // order이 0보다 작아지면 maxOrder로 설정
            order = maxOrder - 1;
        }
    } else {
        // 스크롤을 위로 올리면 count를 증가시킴
        if (order < maxOrder-1) {
            order++;
        } else {
            // order이 maxOrder보다 크면 0으로 설정
            order = 0;
        }
    }
    // 변경된 count에 맞게 이미지 표시
    viewDicomBySeriesinsuidnthrow(seriesinsuid[0]);
}

async function countBySeriesinsuid() {
    const axiosInstance = axios.create({
        baseURL: "http://localhost:8080" // 서버의 URL
    });

    try {
        var seriesCount = countSeriesBySeriesInsUid(studyinsuid)
        let response = await axiosInstance.post("/studies/getseriesInsUidAndCount/" + studyinsuid + "/" +  + "/" + seriesCount, {
            seriesCount: seriesCount
        });

        if (response.status === 200) {
            const seriesinsuidValues = response.data; //배열로 담아있음.
            console.log("seriesinsuid 종류별 값들:", seriesinsuidValues);
            console.log("seriesinsuid 종류 갯수:", seriesinsuidValues.length);
            return seriesinsuidValues;
        }
    } catch (error) {
        console.error(error);
        // 서버 응답 데이터 로깅 추가
        console.error('Server response data:', error.response.data);
    }
}