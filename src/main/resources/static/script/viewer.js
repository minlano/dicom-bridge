var toolbarBtn = document.getElementById("Toolbar_btn");
const thumbnailBtn = document.getElementById("thumbnail_btn");
let isThumbnailVisible = true;
let isToolbarVisible = true;
// 현재 페이지의 URL을 가져옴
var currentUrl = window.location.href;
// seriesCount
var seriesCount = localStorage.getItem("seriesCount");
var studyinsuid = localStorage.getItem("studyinsuid");
// DOMContentLoaded 이벤트가 발생하면 실행되는 함수

thumbnailBtn.addEventListener("click", () => {
    const thumbnailContainer = document.getElementById("thumbnail-container");
    const studyKey = document.getElementById("studyId").value

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
                alert("Failed to retrieve images. Status code: " + xhr.status);
            }
        }
    };
    xhr.send();
}

function displayImages(images) {
    var tbody = document.querySelector("#thumbnail-container tbody");

    for (var imageName in images) {
        if (images.hasOwnProperty(imageName)) {
            var base64Image = images[imageName];

            // 여기서 서버로부터 가져온 이미지들을 어딘가에 저장할 필요가 있어 보임 -> 일단 local

            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var div = document.createElement("div");
            var img = document.createElement("img");
            img.src = "data:image/jpeg;base64," + base64Image;

            div.appendChild(img);
            td.appendChild(div);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    }
}

function showBox(content) {
    document.getElementById('infoBox').style.display = 'inline-block';
}

var infoBox = document.getElementById('infoBox');
var rowCol;
infoBox.addEventListener(('mousemove'), function(e) {
    var X = e.clientY - infoBox.getBoundingClientRect().top;
    var Y = e.clientX - infoBox.getBoundingClientRect().left;
    rowCol = imageLayout(X, Y);
})

infoBox.addEventListener(('click'), function(e) {
    // localStorage.setItem('row', rowCol.row);
    // localStorage.setItem('col', rowCol.col);
    infoBox.style.display = 'none';

    // 여기다가 화면에 레이아웃 잡고 썸네일 조회 코드 작성
    var imageContainer = document.getElementById('image-container');
    imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
    imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
    // 동적으로 이미지 띄우는 코드 작성
    imageDisplay();
})

async function imageDisplay() {
    var imagelistStr = "";
    for(var i = 0; i<rowCol.row; i++) {
        for(var j = 0; j<rowCol.col; j++) {
            var div = document.createElement('div');
            var img = document.createElement('img');

            div.className = `image ${i} ${j}`;
        }
    }
}


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
        if((boxSize * i) + X_GAP < X) { col = i + 1; }
        if((boxSize * i) + Y_GAP < Y) { row = i + 1; }
    }

    var ulRow; var divRow;
    for(var i = 0; i < col; i++) {
        ulRow = infoContent.querySelectorAll('ul')[i];
        for(var j = 0; j < row; j++) {
            divRow = ulRow.querySelectorAll('div')[j];
            var targetImg = divRow.querySelector('img');
            targetImg.src = '/images/filled_box.png';
        }
    }
    return { row: row, col: col };
}

const list_btn = document.getElementById("list_btn");
document.getElementById("list_btn").addEventListener("click", function() {
    window.location.href = "/list";
})

/*************************************************
 *********************URL에서 파라미터 값 추출
 *************************************************/
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/*************************************************
 *********************Seriesinsuid 조회
 *************************************************/

async function countBySeriesinsuid() {
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
            console.log("seriesinsuid 종류별 값들:", seriesinsuidValues);
            console.log("seriesinsuid 종류 갯수:", seriesinsuidValues.length);
        }
    } catch (error) {
        console.error(error);
        // 서버 응답 데이터 로깅 추가
        console.error('Server response data:', error.response.data);
    }
}

