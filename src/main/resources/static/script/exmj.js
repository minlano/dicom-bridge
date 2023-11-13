
//마우스 이벤트 등록
let order = 0;
//테스트 (리스트 입력 시 받는 값)
let seriesinsuid = '1.2.392.200036.9116.4.1.6116.40033.7002'
//HTML 문서 로드 후 파싱된 직후 발생하는 이벤트 (스크롤 이벤트, 이미지 레이아웃 기능 추가시 hover로 변경.)
document.addEventListener('DOMContentLoaded', (event) => {

    document.body.addEventListener("wheel", handleScroll);
});
/*************************************************
 *********************메타데이터 수집(미구현)
 *************************************************/
async function getDicomMetadata(arrayBuffer) { //다이콤 메타 데이터 양식
    const byteArray = new Uint8Array(arrayBuffer);
    const dataSet = dicomParser.parseDicom(byteArray);
    return dataSet;
}

/*************************************************
 *********************Studykey로 조회
 *************************************************/
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

/*************************************************
 *********************seriesinsuid로 조회
 *************************************************/
async function viewDicomBySeriesinsuid(seriesinsuid) {
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

/*************************************************
 *********************seriesinsuid의 특정행 조회
 *************************************************/
async function viewDicomBySeriesinsuidnthrow() {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    try {
        let response = await axios.post("/studies/takeserIesunsuidIndex/"+seriesinsuid+"/"+order, {
            order: order
        }, {
            responseType: 'arraybuffer'
        });
        if (response.status === 200) {
            let arrayBuffer = response.data;
            const dataSet = await getDicomMetadata(arrayBuffer);
            //테스트 div
            const divId = 'print';
            displayDicomImagenthrow(arrayBuffer, divId);
        }
    } catch (error) {
        console.error(error);
    }

}
////////////////////////////////////////////////////////
async function handleScroll(event) {
    // 스크롤 최대값 설정
    let maxOrder =  await countBySeriesinsuid(seriesinsuid)
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
    viewDicomBySeriesinsuidnthrow(seriesinsuid);
}

function displayDicomImage(arrayBuffer) { //dicom 이미지 출력
    const imageId = `dicomweb:${URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/dicom' }))}`;
    const viewportElement = document.createElement('div');
    viewportElement.classList.add('CSViewport');
    viewportElement.id = `viewport-${seriesinsuid}`; // Unique ID for each viewport
    document.getElementById('dicomImageContainer').appendChild(viewportElement);
    cornerstone.enable(viewportElement);
    cornerstone.loadImage(imageId).then(image => {
        cornerstone.displayImage(viewportElement, image);
    });
}

function displayDicomImagenthrow(arrayBuffer, divId) { //dicom 이미지 출력

    seriesinsuid = "1.2.392.200036.9116.4.1.6116.40033.7002";
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