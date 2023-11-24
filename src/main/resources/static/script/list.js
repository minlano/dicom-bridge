let startIndex = 0;
const batchSize = 10;
let totalItems = 0;

$(document).on("click", "#search", function () {

    $('#mainTable tr:gt(0)').remove(); // 첫번째 tr 제외하고 삭제
    $('#previousTable tr:gt(0)').remove();
    startIndex = 0; // 검색 버튼 클릭 시 startIndex 초기화
    previousItems();

    const pid = $('#Pid-input').val();
    const pname = $('#Pname-input').val();
    const reportstatus = $('#category').val();

    fetchDataSomehow(pid, pname, reportstatus, startIndex, batchSize);

});

/** Enter **/
$(document).on("keypress", function (event) {
    if (event.which === 13 || event.keyCode === 13) {
        $('#mainTable tr:gt(0)').remove(); // 첫번째 tr 제외하고 삭제
        $('#previousTable tr:gt(0)').remove();
        startIndex = 0; // 검색 버튼 클릭 시 startIndex 초기화
        previousItems();

        const pid = $('#Pid-input').val();
        const pname = $('#Pname-input').val();
        const reportstatus = $('#category').val();

        fetchDataSomehow(pid, pname, reportstatus, startIndex, batchSize);
    }
});

function fetchDataSomehow(pid, pname, reportstatus, startIndex, batchSize) {
    $.ajax({
        url: "/search/list",
        method: "GET",
        data: { pid: pid, pname: pname, reportstatus: reportstatus, startIndex: startIndex, batchSize: batchSize },
        success: function(response) {
            totalItems = response.length; // 전체 아이템 수
            $('#studyCount').text(totalItems);
            displayItems(response, startIndex, batchSize, totalItems);
        },
        error: function() {
            alert("Error fetching reportstatus");
        }
    });
}

function search(startIndex,batchSize) {
    var pid = $('#Pid-input').val();
    var pname = $('#Pname-input').val();
    var reportstatus = $('#category').val();

    fetchDataSomehow(pid, pname, reportstatus, startIndex, batchSize);
}

$(document).on("click", "#loadMore", function() {
    startIndex += batchSize; // 다음 페이지의 시작 인덱스로 업데이트
    search(startIndex,batchSize);
});

function displayItems(response, startIndex, batchSize, totalItems) {
    let studyListStr = "";
    for (let i = startIndex; i < startIndex + batchSize && i < response.length; i++) {
        let reportStatusText = "";
        switch (response[i].reportstatus) {
            case 3:
                reportStatusText = "읽지 않음";
                break;
            case 4:
                reportStatusText = "열람 중";
                break;
            case 5:
                reportStatusText = "예비판독";
                break;
            case 6:
                reportStatusText = "판독";
                break;
            default:
                reportStatusText = "알 수 없음";
        }
        studyListStr += `<tr class='subTr' data-studyinsuid='${response[i].studyinsuid}' data-studykey='${response[i].studykey}' data-modality='${response[i].modality}' data-pname='${response[i].pname}'>`;
        studyListStr +=     "<td><input type='checkbox' class='rowCheckbox'></td>";
        studyListStr +=     "<td>" + (i+1) + "</td>";
        studyListStr +=     "<td class='pid'>" + response[i].pid + "</td>";
        studyListStr +=     "<td class='pname'>" + response[i].pname + "</td>";
        studyListStr +=     "<td>" + response[i].modality + "</td>";
        studyListStr +=     "<td class='studyList'>" + response[i].studydesc + "</td>";
        studyListStr +=     "<td>" + response[i].studydate + "</td>";
        studyListStr +=     "<td>" + reportStatusText + "</td>";
        studyListStr +=     "<td>" + response[i].seriescnt + "</td>";
        studyListStr +=     "<td>" + response[i].imagecnt + "</td>";
        studyListStr +=     "<td>" + response[i].verifyflag + "</td>";
        studyListStr += "</tr>";
    }

    const table = document.getElementById("mainTable");
    table.insertAdjacentHTML('beforeend', studyListStr);

    if (startIndex + batchSize >= totalItems)  {
        $("#loadMore").remove();

    } else if ($("#loadMore").length === 0) {
        const loadMoreBtn = "<button id='loadMore'>더보기</button>";
        const buttonContainer = $("<div class='buttonContainer'></div>"); // 테이블 아래 중앙에 버튼을 추가하기 위한 div 요소 생성
        table.insertAdjacentElement('afterend', buttonContainer[0]);
        $(buttonContainer).append(loadMoreBtn);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).on("dblclick", "tr.subTr", function() {
    const studyinsuid = $(this).data('studyinsuid');
    const studykey = $(this).data('studykey');
    const modality = $(this).data('modality');
    const pname = $(this).data('pname');
    const pid = $(this).find('.pid').text();
    if (studyinsuid && studykey) { //같은 modal의 studyinsuid 종류별로 찾기
        let first = Date.now();
        saveRedis(modality);
        let second = Date.now();
        sleep(2000).then(() => {
            console.log("Redis 이미지 저장 소요 시간 : " + (second-first));
        });
        setTimeout(10000);
        $.ajax({
            type: "POST",
            url: "/studies/seriescount/" + studyinsuid,
            success: function(data) {
                var seriesCount = data; // 시리즈 갯수.

                // LocalStorage에 데이터 저장
                //localStorage.setItem("studyinsuidKey", JSON.stringify(data)); // studyinsuid키값 배열
                localStorage.setItem("modality", modality);
                localStorage.setItem("seriesCount", seriesCount);
                localStorage.setItem("studyinsuid", studyinsuid);
                localStorage.setItem("pname", pname);
                localStorage.setItem("pid", pid);

                window.location.href = "/viewer/" + studyinsuid + "/" + studykey; // 성공적으로 요청을 받아온 후에 페이지 리디렉션을 수행
            },
            error: function(xhr, status, error) {
                alert("실패 사유: " + xhr.status);
            }
        });
    } else {
        alert("Data not available");
    }
});

/** Report **/
$(document).ready(function() {
    function setReportInput(reportstatus) { // reportstatus에 따라 입력될 값을 설정하는 함수
        const adminInput = "administrator";
        const empty = "";

        // 먼저 text3, text5, text6 값 비워주기
        $("#text3, #text5, #text6").val(empty);

        if (reportstatus === 3) {
            $("#text3").val(adminInput);
        } else if (reportstatus === 5) {
            $("#text5").val(adminInput);
        } else if (reportstatus === 6) {
            $("#text6").val(empty);
        }
    }

    $(document).on("click", "tr.subTr", function() { // 클릭 이벤트에 reportstatus를 받아와서 처리하는 코드
        const studykey = $(this).data('studykey');

        if (studykey) {
            $.ajax({ // 서버에 studykey를 전송하여 reportstatus 값을 가져오는 요청
                url: "/getReportStatus",
                method: "GET",
                data: { studykey: studykey },
                success: function(response) {
                    const reportStatusSelect = $("<select>"); // 서버로부터 받은 reportstatus 값을 기반으로 <select> 요소 생성

                    for (const status of response) { // response에는 적절한 reportstatus 값들이 들어있어야 함
                        reportStatusSelect.append(`<option value="${status}">${status}</option>`);
                    }

                    $("#reportStatusSelectContainer").empty().append(reportStatusSelect); // 기존의 <select> 요소를 제거하고 새로 생성된 <select> 요소 추가

                    const selectedStatus = reportStatusSelect.val(); // reportstatus에 따라 입력될 값을 설정
                    setReportInput(parseInt(selectedStatus));

                    $.ajax({ // 서버에 getInterpretation 요청을 보내고 결과를 받아 처리
                        url: "/getInterpretation",
                        method: "GET",
                        data: { studykey: studykey },
                        success: function(interpretationResponse) {
                            const interpretationValue = interpretationResponse.length > 0 ? interpretationResponse[0] : ''; // interpretationResponse가 배열이라면 첫 번째 요소를 선택

                            $("#interpretation").val(interpretationValue); // <textarea> 요소에 값을 설정
                        },
                        error: function() {
                            alert("Error fetching interpretation");
                        }
                    });
                },
                error: function() {
                    alert("Error fetching reportstatus");
                }
            });
        } else {
            alert("Data not available");
        }
    });

    $(document).on("change", "#reportStatusSelectContainer select", function() { // reportstatus 값이 변경될 때 호출되는 이벤트 처리
        const selectedStatus = $(this).val();
        setReportInput(parseInt(selectedStatus)); // 기존 input 요소의 값을 변경
    });
});



/** Previous Search **/
function previousItems() {
    $.ajax({
        url: "/study/list",
        success: function(response) {
            previous(response);
        },
        error: function() {
            alert("Error Occur!");
        }
    });
}

function previous(response) {
    $(document).on("click", "#mainTable .subTr", function () {
        $('#previousTable tr:gt(0)').remove();

        const pid = $(this).find('.pid').text();
        const pname = $(this).find('.pname').text();

        $('#span-pid').text(pid);
        $('#span-pname').text(pname);

        let previousList = "";
        for (let i = 0; i < response.length; i++) {
            if (pid === response[i].pid){
                previousList += `<tr class='subTr' data-studyinsuid='${response[i].studyinsuid}' data-studykey='${response[i].studykey}'>`;
                previousList += "<td>" + response[i].modality + "</td>";
                previousList += "<td>" + response[i].studydesc + "</td>";
                previousList += "<td>" + response[i].studydate + "</td>";
                previousList += "<td>" + response[i].reportstatus + "</td>";
                previousList += "<td>" + response[i].seriescnt + "</td>";
                previousList += "<td>" + response[i].imagecnt + "</td>";
                previousList += "</tr>";
            }
        }

        const table = document.getElementById("previousTable");
        table.insertAdjacentHTML('beforeend', previousList);
    });
}

/** Detail Search **/
$(document).on("click", "#Dsearch", function() {
    var detailedSearch = $("#Detailed-search");

    if (detailedSearch.css('display') === 'block') {
        detailedSearch.css('display', 'none');
    } else {
        detailedSearch.css('display', 'block');
    }
});

/** Download Checkbox **/
$(document).ready(function() {
    $("#masterCheckbox").click(function(){ // 마스터 체크박스 클릭 시 모든 체크박스 상태 변경
        $(".rowCheckbox").prop('checked', $(this).prop('checked'));
    });

    $(document).on("click", "#masterCheckbox", function() { // 맨 위에 있는 체크박스 클릭 시 모든 체크박스 상태 변경
        $(".rowCheckbox").prop('checked', $(this).prop('checked'));
    });

    $(document).on("click", ".rowCheckbox", function() { // 검색 결과 리스트의 체크박스가 하나라도 선택되어 있으면 맨 위의 체크박스도 선택 상태로 변경
        if ($(".rowCheckbox:checked").length > 0) {
            $("#masterCheckbox").prop('checked', true);
        } else {
            $("#masterCheckbox").prop('checked', false);
        }
    });
});

/** Download **/
$(".download-btn").click(function() {
    const selectedStudyKeys = []; // 체크된 체크박스들의 studykey를 추출
    $(".rowCheckbox:checked").each(function() {
        const studyKey = $(this).closest('tr').data('studykey');
        if (studyKey) {
            selectedStudyKeys.push(studyKey);
        }
    });

    if (selectedStudyKeys.length > 0) {
        downloadImages(selectedStudyKeys); // 서버에 이미지 다운로드 요청
    } else {
        alert("선택된 이미지가 없습니다.");
    }
});

async function downloadImages(selectedStudyKeys) {
    try {
        for (const studyKey of selectedStudyKeys) {
            const downloadUrl = `/studies/download/${studyKey}`;
            const response = await fetch(downloadUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${studyKey}.zip`;

            link.click(); // Automatically click the link to trigger the download
        }
    } catch (error) {
        console.error("이미지 다운로드에 실패했습니다.", error);
    }
}

/**
 * Redis Save
 * key:studyinsuid,
 * value:seriesinsuid
 */
function saveRedis(modality){
    $.ajax({
        url: "/getsameModalstudyinsuid",
        method: "GET",
        data: {
            modality: modality,
        },
        success: function (data) {
            const studyinsuidKey = data; //studyinsuid키, seriesinsuid벨류 의 배열
            for (var i = 0; i < data.length; i++) {
                var studyinsuid = data[i];
                //studyinsuid키값으로 seriesinsuid벨류값으로 해서 redis에 저장하는 함수
                saveRedisValSeriesinsuid(studyinsuid);
                //사용법.
                //키:studyinsuid 벨류:seriesinsuid의 종류를 ,로 나눠서 저장
                // 저장된 값을 다시 리스트로 변환
                //List<String> retrievedList = Arrays.asList(storedValue.split(","));
                //키:seriesinsuid 벨류:seriesinsuid의 사진 갯수
                //키:seriesinsuid:이미지번호.getBytes() 벨류:이미지 바이트
            }
            localStorage.setItem("studyinsuidKey", JSON.stringify(data)); // studyinsuid키값 배열
        }
    });
}

function saveRedisValSeriesinsuid(studyinsuid){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/studies/saveRedisValSeriesinsuid/" + studyinsuid, true);
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