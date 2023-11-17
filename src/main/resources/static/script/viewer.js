var toolbarBtn = document.getElementById("Toolbar_btn");
const thumbnailBtn = document.getElementById("thumbnail_btn");
let isThumbnailVisible = true;
let isToolbarVisible = true;

/**
 * ThumbNail
 */
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

/**
 * To Worklist
 */
document.getElementById("list_btn").addEventListener("click", function() {
    window.location.href = "/list";
})