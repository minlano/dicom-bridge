var toolbarBtn = document.getElementById("Toolbar_btn");
const thumbnailBtn = document.getElementById("thumbnail_btn");
let isThumbnailVisible = true;
let isToolbarVisible = true;

thumbnailBtn.addEventListener("click", () => {
    const thumbnailContainer = document.getElementById("thumbnail-container");
    const imageContainer = document.getElementById("image-container");

    if (isThumbnailVisible) {
        thumbnailContainer.style.display = "none";

        // 이미지 컨테이너의 그리드 레이아웃 변경
        imageContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
        imageContainer.style.gridTemplateRows = "repeat(2, 1fr)";
    } else {
        thumbnailContainer.style.display = "block";

        // 이미지 컨테이너의 그리드 레이아웃 변경
        imageContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
        imageContainer.style.gridTemplateRows = "repeat(2, 1fr)";
    }
    isThumbnailVisible = !isThumbnailVisible;
});


toolbarBtn.addEventListener("click", () => {
    var toolbar = document.getElementById("toolbar");
    const imageContainer = document.getElementById("image-container");

    if (isToolbarVisible) {
        toolbar.style.display = "none";
    } else {
        toolbar.style.display = "block";
    }
    isToolbarVisible = !isToolbarVisible;

});

