var toolbarBtn = document.getElementById("Toolbar_btn");
const thumbnailBtn = document.getElementById("thumbnail_btn");
let isThumbnailVisible = true;
let isToolbarVisible = true;
// 현재 페이지의 URL을 가져옴
var currentUrl = window.location.href;
// seriesCount
var seriesCount = localStorage.getItem("seriesCount");
var studyinsuid = localStorage.getItem("studyinsuid");

// 스크롤 최대값 설정
let order = 1;



document.addEventListener("DOMContentLoaded", function() {
    // 페이지가 로딩되면 실행될 코드
    // 마우스 스크롤 이벤트 나중에 호버+@하면서 추가할 것
   // document.body.addEventListener("wheel", handleScroll);
    // countBySeriesinsuid 함수 호출

    rowCol.col = 2; rowCol.row = 2;
    var imageContainer = document.getElementById('image-container');
    imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
    imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
    imageDisplay()
});


thumbnailBtn.addEventListener("click", () => {
    const thumbnailContainer = document.getElementById("thumbnail-container");
    const studyKey = document.getElementById("studyId").value;

    if (isThumbnailVisible) {
        thumbnailContainer.style.display = "block";
        showThumbnail(studyKey);
    } else {
        thumbnailContainer.style.display = "none";
        var tbody = document.querySelector("#thumbnail-container tbody");
        tbody.innerHTML = "";
    }
    isThumbnailVisible = !isThumbnailVisible;
});


toolbarBtn.addEventListener("click", () => {
    var toolbar = document.getElementById("toolbar");

    if (isToolbarVisible) {
        toolbar.style.display = "none";
    } else {
        toolbar.style.display = "block";
    }
    isToolbarVisible = !isToolbarVisible;

});

function showThumbnail(path) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/studies/getThumbnail/" + path, true);
    xhr.setRequestHeader("Content-Type", "application/json")

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var imagesData = JSON.parse(xhr.responseText);
                displayImages(imagesData);
            } else {
                alert("Failed - Status code: " + xhr.status);
            }
        }
    };
    xhr.send();
}

function displayImages(images) {
    var tbody = document.querySelector("#thumbnail-container tbody");

    for (var imageName in images) {
        if (images.hasOwnProperty(imageName)) {
            var base64Image = images[imageName].image;
            var seriesKey = images[imageName].serieskey;
            var seriesDesc = images[imageName].seriesdesc;

            // 여기서 서버로부터 가져온 이미지들을 어딘가에 저장할 필요가 있어 보임 -> 일단 localStorage 시도(아직시작안함)
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var divImg = document.createElement("div");
            var img = document.createElement("img");
            var divDesc = document.createElement("div");

            divDesc.className = "thumbnail-desc";
            divDesc.innerHTML = `Series Number : ${seriesKey}<br> &nbsp&nbsp&nbsp Series Desc : ${seriesDesc}`;
            img.src = "data:image/jpeg;base64," + base64Image;

            divImg.appendChild(img);
            td.appendChild(divDesc);
            td.appendChild(divImg);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    }
}

function showBox(content) {
    document.getElementById('infoBox').style.display = 'inline-block';
}

var infoBox = document.getElementById('infoBox');
var rowCol = {row: 2, col: 2};
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

var imageContainer = document.getElementById('image-container');
infoBox.addEventListener(('click'), function(e) {
    infoBox.style.display = 'none';

    // 여기다가 화면에 레이아웃 잡고 썸네일 조회 코드 작성
    imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
    imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
    seriesDisplay2Grid();
})

// async function imageDisplay() {
//     for(var i = 0; i<rowCol.row; i++) {
//         for (var j = 0; j < rowCol.col; j++) {
//             var div = document.createElement('div');
//             var img = document.createElement('img');
//
//             div.className = `image ${i} ${j}`;
//             div.appendChild(img);
//             return div;
//         }
//     }
// }
async function imageDisplay() {
    // var imageContainer = document.getElementById('image-container');
    var index = 0;
    for(var i = 0; i<rowCol.row; i++) {
        for (var j = 0; j < rowCol.col; j++) {
            var div = document.createElement('div');
           // var img = document.createElement('img');

            div.className = `image ${i} ${j}`;
            var id = `image_${i}_${j}`;
            div.id = id;
            div.setAttribute('data-div-id', id); // data-div-id 속성에 id 값을 저장
            document.body.appendChild(div);
            imageContainer.appendChild(div);
            //div.appendChild(img);
            // 문자열을 정수로 변환
            var numericI = parseInt(i, 10);
            var numericJ = parseInt(j, 10);

            if(seriesCount>index){

                viewDicomBySeriesinsuidnthrow(id, index);
            }
            index ++;
            //return div;
        }
    }
}


const list_btn = document.getElementById("list_btn");
document.getElementById("list_btn").addEventListener("click", function() {
    window.location.href = "/list";
})

/**
 * Cornerstone
 */
/* viewer 페이지로 넘어올 때 바로 series 별로 이미지를 layout에 넣어야 함 */
// seriesImageView();
// function seriesImageView() {
//     var studyInsUidValue = document.getElementById('studyInsUid').textContent;
//     // var studyIdValue = document.getElementById('studyId').textContent;
//     viewDicomBySeriesinsuid(studyInsUidValue);
// }


let order = 0;
document.addEventListener('DOMContentLoaded', (event) => {
    seriesDisplay2Grid();

    // document.body.addEventListener("wheel", handleScroll);
});

async function handleScroll(event) {
    // 스크롤 최대값 설정
    let maxOrder =  await countBySeriesinsuid(seriesinsuid);
    console.log(order+"/"+maxOrder);

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
    viewDicomBySeriesInsUid(seriesinsuid);
}

async function viewDicomBySeriesInsUid(seriesinsuid) {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    try {
        let response = await axios.post("/studies/takeserIesunsuidIndex/" + seriesinsuid + "/" + order, {
            order: order
        }, {
            responseType: 'arraybuffer'
        });
        if (response.status === 200) {
            let arrayBuffer = response.data;
            displayDicomImage(arrayBuffer);
        }

    } catch (error) {
        console.error(error);
    }
}

function displayDicomImage(arrayBuffer) { //dicom 이미지 출력
    const imageId = `dicomweb:${URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/dicom' }))}`;

    divId.innerHTML = '';
    // 이미 존재하는 div 찾기
    const existingDiv = document.getElementById(divId);


    if(existingDiv){
        cornerstone.enable(existingDiv);
        cornerstone.loadImage(imageId).then(image => {
            cornerstone.displayImage(existingDiv, image);
        });
    }else {
        console.error(`Div with ID '${existingDiv}' not found.`);
    }
}

function seriesDisplay2Grid() {
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }

    for(var i = 0; i < rowCol.row; i++) {
        for (var j = 0; j < rowCol.col; j++) {
            var div = document.createElement('div');
            div.className = `image ${i} ${j}`;
            div.addEventListener('wheel', handleScroll);
            imageContainer.appendChild(div);
        }
    }

    getSeriesByStudyInsUid(studyinsuid);
}

/*************************************************
 *********************Seriesinsuid 조회
 *************************************************/

async function findBySeriesinsuid() {
    const axiosInstance = axios.create({
        baseURL: "http://localhost:8080" // 서버의 URL
    });

    try {
        let response = await axiosInstance.post("/studies/getseriesinsuid/" + studyinsuid+"/" + seriesCount, {
            seriesCount: seriesCount
        });

        if (response.status === 200) {
            //값 받아오기
            const seriesinsuidValues = response.data; //배열로 담아있음.
            //리스트에서 가져온var seriesCount = localStorage.getItem("seriesCount");
            //의 갯수만큼 있음.
            //console.log("seriesinsuid 종류별 값들:", seriesinsuidValues);
            //console.log("seriesinsuid 종류 갯수:", seriesinsuidValues.length);
            return seriesinsuidValues;
        }
    } catch (error) {
        console.error(error);
        // 서버 응답 데이터 로깅 추가
        console.error('Server response data:', error.response.data);
    }
}

/*************************************************
 *********************seriesinsuid의 특정행 조회
 *************************************************/
async function viewDicomBySeriesinsuidnthrow(id, index) {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    const seriesinsuid = await findBySeriesinsuid();
    let tempseriesinsuid = seriesinsuid[index];
    console.log(tempseriesinsuid);
    try {
        let response = await axios.post("/studies/takeserIesunsuidIndex/"+tempseriesinsuid+"/"+order, {
            order: order
        }, {
            responseType: 'arraybuffer'
        });
        if (response.status === 200) {
            let arrayBuffer = response.data;
            //const dataSet = await getDicomMetadata(arrayBuffer);

            const divId = id;
            displayDicomImagenthrow(arrayBuffer, divId);
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

/*************************************************
 *********************Seriesinsuid 총 갯수 조회
 *************************************************/
async function countBySeriesinsuid(seriesinsuid) {


    const axiosInstance = axios.create({
        baseURL: "http://localhost:8080" // 서버의 URL
    });

    try {
        let response = await axiosInstance.post("/studies/seriesinsuidcount/" + seriesinsuid, {
            seriesinsuid: seriesinsuid
        });

        if (response.status === 200) {
            let count = response.data;
            console.log(count);
            return count;
        }
    } catch (error) {
        console.error(error);
        // 서버 응답 데이터 로깅 추가
        console.error('Server response data:', error.response.data);
    }
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

async function handleScroll(event) {

    let maxOrder = await countBySeriesinsuid(seriesinsuid[1])

    console.log(order+"/"+maxOrder);
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