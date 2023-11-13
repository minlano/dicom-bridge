var toolbarBtn = document.getElementById("Toolbar_btn");
const thumbnailBtn = document.getElementById("thumbnail_btn");
let isThumbnailVisible = true;
let isToolbarVisible = true;

thumbnailBtn.addEventListener("click", () => {
    const thumbnailContainer = document.getElementById("thumbnail-container");

    if (isThumbnailVisible) {
        thumbnailContainer.style.display = "block";
        showThumbnail('17');
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
            var img = document.createElement("img");
            img.src = "data:image/jpeg;base64," + base64Image;

            td.appendChild(img);
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
            img.src =
        }
    }
}


var infoContent =  document.getElementById('infoContent');
function imageLayout(X, Y) {
    var boxImg = infoContent.querySelectorAll('ul div img');
    boxImg.forEach(function(img) {
        img.src = 'images/blank_box.png';
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
            targetImg.src = 'images/filled_box.png';
        }
    }
    return { row: row, col: col };
}