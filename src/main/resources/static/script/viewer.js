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

// function displayImages(images) {
//     var imagesContainer = document.getElementById("imagesContainer");
//     imagesContainer.innerHTML = "";
//
//     for (var imageName in images) {
//         if (images.hasOwnProperty(imageName)) {
//             var base64Image = images[imageName];
//             var img = document.createElement("img");
//             img.src = "data:image/jpeg;base64," + base64Image;
//             imagesContainer.appendChild(img);
//         }
//     }
// }


function displayImages(images) {
    var tbody = document.querySelector("#thumbnail-container tbody");

    for (var imageName in images) {
        if (images.hasOwnProperty(imageName)) {
            var base64Image = images[imageName];
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

























