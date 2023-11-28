// infoBox.addEventListener(('mousemove'), function (e) {
//     var X = e.clientY - infoBox.getBoundingClientRect().top;
//     var Y = e.clientX - infoBox.getBoundingClientRect().left;
//     imageLayout(X, Y);
// })
// function imageLayout(X, Y) {
//     var boxImg = infoContent.querySelectorAll('ul div img');
//     boxImg.forEach(function (img) {
//         img.src = '/images/blank_box.png';
//     });
//
//     var boxSize = 22;
//     var X_GAP = 3; var Y_GAP = 3;
//     var row; var col;
//     for(var i= 0; i < 5; i++) {
//         if((boxSize * i) + X_GAP < X) row = i + 1;
//         if((boxSize * i) + Y_GAP < Y) col = i + 1;
//     }
//
//     var ulRow; var divRow;
//     for(var i = 0; i < row; i++) {
//         ulRow = infoContent.querySelectorAll('ul')[i];
//         for(var j = 0; j < col; j++) {
//             divRow = ulRow.querySelectorAll('div')[j];
//             divRow.querySelector('img').src = '/images/filled_box.png';
//         }
//     }
//     rowCol.col = col; rowCol.row = row;
// }
// infoBox.addEventListener(('click'), function (e) {
//     const isChecked = document.querySelector('#image-container2 .checked');
//
//     if (isChecked) {
//         e.stopPropagation();
//         infoBox.style.display = 'none';
//
//         imageContainer2.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
//         imageContainer2.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
//         imageDisplayComparison(studyinsuidComparison);
//     } else {
//         e.stopPropagation();
//         infoBox.style.display = 'none';
//
//         imageContainer.style.gridTemplateRows = `repeat(${rowCol.row}, 1fr)`;
//         imageContainer.style.gridTemplateColumns = `repeat(${rowCol.col}, 1fr)`;
//         imageDisplay();
//     }
// })
// async function imageDisplay() {
//     while (imageContainer.firstChild)
//         imageContainer.removeChild(imageContainer.firstChild);
//
//     var index = 0;
//     var seriesInsUids = await findSeriesInsUidByStudyInsUid();
//     for (var i = 0; i < rowCol.row; i++) {
//         for (var j = 0; j < rowCol.col; j++) {
//             var div = document.createElement('div');
//             var id = `image_${i}_${j}`;
//             div.id = id;
//             div.style.height = "100%";
//             div.style.maxWidth ="100%";
//             div.style.width = "100%";
//             div.style.maxHeight ="100%";
//             div.setAttribute('order', FIRST_ORDER);
//             imageContainer.appendChild(div);
//             createWheelHandler(id, seriesInsUids[index]);
//
//             if (index < seriesCount) {
//                 await viewDicomBySeriesInsUid(id, seriesInsUids[index], FIRST_ORDER);
//                 createBoxHandler(id, seriesInsUids[index]);
//                 activateReset(id);
//             }
//             index++;
//         }
//     }
// }
// function createWheelHandler(id, seriesInsUid) {
//     var individualDiv = document.getElementById(id);
//     individualDiv.addEventListener('wheel', function (event) {
//         handleScroll(event, id, seriesInsUid);
//     });
// }
// async function handleScroll(event, id, seriesInsUid) {
//     var individualDiv = document.getElementById(id);
//     var order = parseInt(individualDiv.getAttribute('order'), 10) || FIRST_ORDER;
//     let maxOrder = await countBySeriesInsUid(seriesInsUid);
//     let scrollAmount = event.deltaY > 0 ? -1 : 1;
//
//     order += scrollAmount;
//     if (order < FIRST_ORDER || order >= maxOrder)
//         order = FIRST_ORDER;
//
//     individualDiv.setAttribute('order', order);
//     await viewDicomBySeriesInsUid(id, seriesInsUid, order);
// }
// async function viewDicomBySeriesInsUid(id, seriesInsUid, order) {
//     let whereDiv = 1;
//     try {
//         let response = await axiosInstance.get("/studies/getSeriesInsUidIndex/" + seriesInsUid + "/" + order, {responseType: 'arraybuffer'});
//         if (response.status === 200)
//             await displayDicomImage(response.data, id, seriesInsUid, order, whereDiv);
//     } catch (error) {
//         console.error(error);
//     }
// }
// async function displayDicomImage(arrayBuffer, divId, seriesInsUid, whereDiv) {
//     const imageData = `dicomweb:${URL.createObjectURL(new Blob([arrayBuffer], {type: 'application/dicom'}))}`;
//     const existingDiv = document.getElementById(divId);
//     existingDiv.style.position = 'relative';
//
//     if (!existingDiv.hasAttribute('data-cornerstone-enabled')) { // 이미 cornerstone이 활성화되었는지 확인
//         cornerstone.enable(existingDiv);
//         existingDiv.setAttribute('data-cornerstone-enabled', 'true');
//     }
//
//     if (existingDiv) {
//         cornerstone.loadImage(imageData).then(async image => {
//             await cornerstone.displayImage(existingDiv, image);
//             await updateMetadata(setMetadata(arrayBuffer), existingDiv, seriesInsUid, whereDiv);
//         });
//     } else {
//         console.error(`Div with ID '${divId}' not found.`);
//     }
// }
// function updateMetadata(metadataArray, existingDiv, seriesInsUid, whereDiv) {
//     let prevMetadataLeftTop = document.getElementById(`${seriesInsUid}_leftTop`+whereDiv);
//     let prevMetadataRightTop = document.getElementById(`${seriesInsUid}_rightTop`+whereDiv);
//     let prevMetadataRightBottom = document.getElementById(`${seriesInsUid}_rightBottom`+whereDiv);
//     if (prevMetadataLeftTop) prevMetadataLeftTop.remove();
//     if (prevMetadataRightTop) prevMetadataRightTop.remove();
//     if (prevMetadataRightBottom) prevMetadataRightBottom.remove();
//
//     let metadataLeftTop = document.createElement('div');
//     metadataLeftTop.id = `${seriesInsUid}_leftTop`+whereDiv;
//
//     metadataLeftTop.style.position = 'absolute';
//     metadataLeftTop.style.top = '0px';
//     metadataLeftTop.style.left = '0px';
//     metadataLeftTop.style.backgroundColor = 'rgba(0, 0, 0, 0)';
//     metadataLeftTop.style.color = 'white';
//     metadataLeftTop.style.padding = '5px';
//     metadataLeftTop.innerHTML = metadataArray.leftTop;
//     metadataLeftTop.style.zIndex = '2';
//     metadataLeftTop.style.visibility = 'visible';
//     existingDiv.appendChild(metadataLeftTop);
//
//     let metadataRightTop = document.createElement('div');
//     metadataRightTop.id = `${seriesInsUid}_rightTop`+whereDiv;
//
//     metadataRightTop.style.position = 'absolute';
//     metadataRightTop.style.top = '0px';
//     metadataRightTop.style.right = '0px';
//     metadataRightTop.style.backgroundColor = 'rgba(0, 0, 0, 0)';
//     metadataRightTop.style.color = 'white';
//     metadataRightTop.style.padding = '5px';
//     metadataRightTop.innerHTML  = metadataArray.rightTop;
//     metadataRightTop.style.zIndex = '2';
//     metadataRightTop.style.visibility = 'visible';
//     existingDiv.appendChild(metadataRightTop);
//
//     let metadataRightBottom = document.createElement('div');
//     metadataRightBottom.id = `${seriesInsUid}_rightBottom`+whereDiv;
//
//     metadataRightBottom.style.position = 'absolute';
//     metadataRightBottom.style.bottom = '0px';
//     metadataRightBottom.style.right = '0px';
//     metadataRightBottom.style.backgroundColor = 'rgba(0, 0, 0, 0)';
//     metadataRightBottom.style.color = 'white';
//     metadataRightBottom.style.padding = '5px';
//     metadataRightBottom.innerHTML  = metadataArray.rightBottom;
//     metadataRightBottom.style.zIndex = '2';
//     metadataRightBottom.style.visibility = 'visible';
//     existingDiv.appendChild(metadataRightBottom);
// }


function imageDisplay() {}
function viewDicomBySeriesInsUid() {}
function displayDicomImage() {}
function updateMetadata() {}

function createWheelHandler() {}
function handleScroll() {}