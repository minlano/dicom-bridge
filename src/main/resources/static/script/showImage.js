function showDicomImages(path) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/studies/" + path, true);
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
    var imagesContainer = document.getElementById("imagesContainer");
    imagesContainer.innerHTML = "";

    for (var imageName in images) {
        if (images.hasOwnProperty(imageName)) {
            var base64Image = images[imageName];
            var img = document.createElement("img");
            img.src = "data:image/jpeg;base64," + base64Image;
            imagesContainer.appendChild(img);
        }
    }
}