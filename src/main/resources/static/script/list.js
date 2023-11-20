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

// 엔터 키인 경우
$(document).on("keypress", function (event) {
    if (event.which === 13 || event.keyCode === 13) {
        // 여기에 엔터 키를 처리하는 코드 추가

        // 기존 코드
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
        url: "/search-list",
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
        studyListStr += `<tr class='subTr' data-studyinsuid='${response[i].studyinsuid}' data-studykey='${response[i].studykey}'>`;
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


$(document).on("dblclick", "tr.subTr", function() {
    const studyinsuid = $(this).data('studyinsuid');
    const studykey = $(this).data('studykey');

    if (studyinsuid && studykey) {
        $.ajax({
            type: "POST",
            url: "/studies/seriescount/" + studyinsuid,
            success: function(data) {
                var seriesCount = data; // 시리즈 갯수.
                //페이지 이동 후
                //var seriesCount = localStorage.getItem("seriesCount"); 로 사용

                // LocalStorage에 데이터 저장
                localStorage.setItem("seriesCount", seriesCount);
                localStorage.setItem("studyinsuid", studyinsuid);

                // 성공적으로 요청을 받아온 후에 페이지 리디렉션을 수행
                window.location.href = "/viewer/" + studyinsuid + "/" + studykey;
            },
            error: function(xhr, status, error) {
                alert("실패 사유: " + xhr.status);
            }
        });
    } else {
        alert("Data not available");
    }
});


// 리포트
$(document).ready(function() {
    // reportstatus에 따라 입력될 값을 설정하는 함수
    function setReportInput(reportstatus) {
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

    // 클릭 이벤트에 reportstatus를 받아와서 처리하는 코드
    $(document).on("click", "tr.subTr", function() {
        const studykey = $(this).data('studykey');

        if (studykey) {
            // 서버에 studykey를 전송하여 reportstatus 값을 가져오는 요청
            $.ajax({
                url: "/getReportStatus",
                method: "GET",
                data: { studykey: studykey },
                success: function(response) {
                    // 서버로부터 받은 reportstatus 값을 기반으로 <select> 요소 생성
                    const reportStatusSelect = $("<select>");

                    // response에는 적절한 reportstatus 값들이 들어있어야 함
                    for (const status of response) {
                        reportStatusSelect.append(`<option value="${status}">${status}</option>`);
                    }

                    // 기존의 <select> 요소를 제거하고 새로 생성된 <select> 요소 추가
                    $("#reportStatusSelectContainer").empty().append(reportStatusSelect);

                    // reportstatus에 따라 입력될 값을 설정
                    const selectedStatus = reportStatusSelect.val();
                    setReportInput(parseInt(selectedStatus));

                    // 서버에 getInterpretation 요청을 보내고 결과를 받아 처리
                    $.ajax({
                        url: "/getInterpretation",
                        method: "GET",
                        data: { studykey: studykey },
                        success: function(interpretationResponse) {
                            // interpretationResponse가 배열이라면 첫 번째 요소를 선택
                            const interpretationValue = interpretationResponse.length > 0 ? interpretationResponse[0] : '';

                            // <textarea> 요소에 값을 설정
                            $("#interpretation").val(interpretationValue);
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

    // reportstatus 값이 변경될 때 호출되는 이벤트 처리
    $(document).on("change", "#reportStatusSelectContainer select", function() {
        const selectedStatus = $(this).val();

        // 기존 input 요소의 값을 변경
        setReportInput(parseInt(selectedStatus));
    });
});



/* 이전검색 */
function previousItems() {
    $.ajax({
        url: "/study-list",
        success: function(response) {
            previous(response);
        },
        error: function() {
            alert("Error Occur!");
        }
    });
}

//Previous 동일한 환자 정보 불러오기
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


//세부검색
$(document).on("click", "#Dsearch", function() {
    var detailedSearch = $("#Detailed-search");

    if (detailedSearch.css('display') === 'block') {
        detailedSearch.css('display', 'none');
    } else {
        detailedSearch.css('display', 'block');
    }
});
$(document).ready(function() {
    // 마스터 체크박스 클릭 시 모든 체크박스 상태 변경
    $("#masterCheckbox").click(function(){
        $(".rowCheckbox").prop('checked', $(this).prop('checked'));
    });

    // 맨 위에 있는 체크박스 클릭 시 모든 체크박스 상태 변경
    $(document).on("click", "#masterCheckbox", function() {
        $(".rowCheckbox").prop('checked', $(this).prop('checked'));
    });

    // 검색 결과 리스트의 체크박스가 하나라도 선택되어 있으면 맨 위의 체크박스도 선택 상태로 변경
    $(document).on("click", ".rowCheckbox", function() {
        if ($(".rowCheckbox:checked").length > 0) {
            $("#masterCheckbox").prop('checked', true);
        } else {
            $("#masterCheckbox").prop('checked', false);
        }
    });
});
// 이미지 다운로드 버튼 클릭 시 이벤트 처리
$(".download-btn").click(function() {
    // 체크된 체크박스들의 studykey를 추출
    const selectedStudyKeys = [];
    $(".rowCheckbox:checked").each(function() {
        const studyKey = $(this).closest('tr').data('studykey');
        if (studyKey) {
            selectedStudyKeys.push(studyKey);
        }
    });

    if (selectedStudyKeys.length > 0) {
        // 서버에 이미지 다운로드 요청
        downloadImages(selectedStudyKeys);
    } else {
        alert("선택된 이미지가 없습니다.");
    }
});

// 서버에 이미지 다운로드 요청을 보내는 함수
function downloadImages(selectedStudyKeys) {
    // 각 studyKey에 대해 다운로드 요청을 보냄
    selectedStudyKeys.forEach(function(studyKey) {
        const downloadUrl = `/studies/download/${studyKey}`;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", downloadUrl, true);
        xhr.responseType = "arraybuffer";

        xhr.onload = function() {
            if (xhr.status === 200) {
                const blob = new Blob([xhr.response], { type: "application/octet-stream" });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = `${studyKey}.dcm`;
                link.click();
            } else {
                alert(`StudyKey ${studyKey} 이미지 다운로드에 실패했습니다.`);
            }
        };

        xhr.send();
    });
}