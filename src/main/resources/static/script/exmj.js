
async function getDicomMetadata(arrayBuffer) { //다이콤 메타 데이터 양식
    const byteArray = new Uint8Array(arrayBuffer);
    const dataSet = dicomParser.parseDicom(byteArray);

    return dataSet;
}
async function viewDicomByStudykey(studykey) { //studykey로 다이콩 찾기
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    try {
        // let seriesTabList = await getSeriesTab();
        //
        // for (const item of seriesTabList) {
        //     let directoryPath = await getImagePath(item.studykey, item.seriesinsuid);
        //     let response = await axios.get("/getDicomFile", {
        //         params: {
        //             directoryPath: directoryPath
        //         },
        //         responseType: 'arraybuffer'
        //     });
        let response = await axios.post("/studies/getFile/"+ studykey, null, {

            responseType: 'arraybuffer'
        });
            if (response.status === 200) {
                let arrayBuffer = response.data;
                const dataSet = await getDicomMetadata(arrayBuffer);
                displayDicomImage(arrayBuffer);
            }

    } catch (error) {
        console.error(error);
    }
}
function viewDicomBySeriesinsuid(seriesinsuid) {
    var xhr = new XMLHttpRequest();
    var url = "/studies/seriesinsuidcount/"+seriesinsuid;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var count = JSON.parse(xhr.responseText);
            console.log("Count: " + count);
            alert(count)
            // 여기에서 count 변수를 사용하여 원하는 작업을 수행할 수 있습니다.
        }
    };

}

async function viewDicomBySeriesinsuid2(seriesinsuid) {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    try {
        let response = await axios.post("/studies/takeuidgiveseriesnum/" + seriesinsuid, null, {
            responseType: 'arraybuffer'
        });
        if (response.status === 200) {
            let arrayBuffer = response.data;
            const dataSet = await getDicomMetadata(arrayBuffer);
            displayDicomImage(arrayBuffer);
        }

    } catch (error) {
        console.error(error);
    }
}

function displayDicomImage(arrayBuffer) { //dicom 이미지 출력
    seriesinsuid = "1.2.410.200013.1.510.1.20210310170346596.0008";
    const imageId = `dicomweb:${URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/dicom' }))}`;
    alert(imageId)
    const viewportElement = document.createElement('div');
    viewportElement.classList.add('CSViewport');
    viewportElement.id = `viewport-${seriesinsuid}`; // Unique ID for each viewport
    document.getElementById('dicomImageContainer').appendChild(viewportElement);

    cornerstone.enable(viewportElement);
    cornerstone.loadImage(imageId).then(image => {
        cornerstone.displayImage(viewportElement, image);
    });
}




async function getSeriesTab() { //아직 안씀(seriesTab)

    try {
        const pathArray = window.location.pathname.split('/');
        const studykey = pathArray[2];

        let response = await axios.get("/v1/storage/search/PacsSeriestab", {
            params: {
                studykey: studykey
            }
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
}