
//마우스 이벤트 등록
let order = 0;
//테스트
let seriesinsuid = '1.2.392.200036.9116.4.1.6116.40033.7002'

//HTML 문서 로드 후 파싱된 직후 발생하는 이벤트
document.addEventListener('DOMContentLoaded', (event) => {

    document.body.addEventListener("wheel", handleScroll);
});





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


async function viewDicomBySeriesinsuid(seriesinsuid) {


    const axiosInstance = axios.create({
        baseURL: "http://localhost:8080" // 실제 서버의 URL로 대체해야 합니다.
    });

    try {
        let response = await axiosInstance.post("/studies/seriesinsuidcount/" + seriesinsuid, {
            seriesinsuid: seriesinsuid
        });

        if (response.status === 200) {
            let count = response.data;
            console.log(count); // 이제 count 변수에 응답 데이터가 들어가게 됩니다.
        }
    } catch (error) {
        console.error(error);
        // 서버 응답 데이터 로깅 추가
        console.error('Server response data:', error.response.data);
    }
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

async function viewDicomBySeriesinsuidTotal(seriesinsuid) {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    const axiosInstance = axios.create({
        baseURL: "http://localhost:8080" // 실제 서버의 URL로 대체해야 합니다.
    });

    try {
        let response = await axiosInstance.post("/studies/seriesinsuidcount/" + seriesinsuid, {
            seriesinsuid: seriesinsuid
        });

        if (response.status === 200) {
            //let count = response.data;


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
                        displayDicomImageTest(arrayBuffer, divId);
                    }


                } catch (error) {
                    console.error(error);
                }




        }
    } catch (error) {
        console.error(error);
        // 서버 응답 데이터 로깅 추가
        console.error('Server response data:', error.response.data);
    }
}
////////////////////////////////////////////////////////
function handleScroll(event) {
    if (event.deltaY > 0) {
        // 스크롤을 아래로 내리면 count를 증가시킴
        order++;
    } else {
        // 스크롤을 위로 올리면 count를 감소시킴
        order = Math.max(0, order - 1);
    }

    // 변경된 count에 맞게 이미지 표시
    viewDicomBySeriesinsuidTotal(seriesinsuid);
}


////////////////////////////////////////////////////////
// async function viewDicomBySeriesinsuidTotal(seriesinsuid) {
//     cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
//     cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
//
//     const axiosInstance = axios.create({
//         baseURL: "http://localhost:8080" // 실제 서버의 URL로 대체해야 합니다.
//     });
//
//     try {
//         let response = await axiosInstance.post("/studies/seriesinsuidcount/" + seriesinsuid, {
//             seriesinsuid: seriesinsuid
//         });
//
//         if (response.status === 200) {
//             let count = response.data;
//
//             for(let i =0; i< count; i++ ){ // 갯수만큼
//
//                 try {
//                     let order = i;
//                     let response = await axios.post("/studies/takeserIesunsuidIndex/"+seriesinsuid+"/"+order, {
//                         count: i
//                     }, {
//                         responseType: 'arraybuffer'
//                     });
//                     if (response.status === 200) {
//                         let arrayBuffer = response.data;
//                         const dataSet = await getDicomMetadata(arrayBuffer);
//                         displayDicomImage(arrayBuffer);
//                     }
//
//
//                 } catch (error) {
//                     console.error(error);
//                 }
//
//
//             }
//
//         }
//     } catch (error) {
//         console.error(error);
//         // 서버 응답 데이터 로깅 추가
//         console.error('Server response data:', error.response.data);
//     }
// }
////////////////////////////////////////////////////////





async function viewDicomBySeriesinsuid3(seriesinsuid) {
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

// Assuming you have a function to read a file as ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = function (event) {
            resolve(event.target.result);
        };

        reader.onerror = function (event) {
            reject(event.target.error);
        };

        reader.readAsArrayBuffer(file);
    });
}


/////////////////////////////////////////

function displayDicomImage(arrayBuffer) { //dicom 이미지 출력
    seriesinsuid = "1.2.392.200036.9116.4.1.6116.40033.7002";
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

function displayDicomImageTest(arrayBuffer, divId) { //dicom 이미지 출력

    seriesinsuid = "1.2.392.200036.9116.4.1.6116.40033.7002";
    const imageId = `dicomweb:${URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/dicom' }))}`;

    // 이미 존재하는 div 찾기
    const existingDiv = document.getElementById(divId);

    //existingDiv.innerHTML = '';

    if(existingDiv){
   // const viewportElement = document.createElement('div');
  //  viewportElement.classList.add('CSViewport');
   // viewportElement.id = `viewport-${seriesinsuid}`; // Unique ID for each viewport
  //  document.getElementById('dicomImageContainer').appendChild(viewportElement);
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