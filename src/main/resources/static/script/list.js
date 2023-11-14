let startIndex = 0;
const batchSize = 10;
let totalItems = 0;

$("#search").click(function() {
    startIndex = 0; // 검색 버튼 클릭 시 startIndex 초기화
    fetchItems(startIndex, batchSize);
});

$(document).on("click", "#loadMore", function() {
    fetchItems(startIndex, batchSize);
    startIndex += batchSize;
});

function fetchItems(startIndex, batchSize) {
    $.ajax({
        url: "/study-list", // 데이터를 가져오는 엔드포인트
        success: function(response) {
            totalItems = response.length; // 전체 아이템 수
            displayItems(response, startIndex, batchSize, totalItems);
        },
        error: function() {
            alert("Error Occur!");
        }
    });
}

function displayItems(response, startIndex, batchSize, totalItems) {
    let studyListStr = "";
    for (let i = startIndex; i < startIndex + batchSize && i < response.length; i++) {
        studyListStr += `<tr class='subTr' data-studyinsuid='${response[i].studyinsuid}' data-studykey='${response[i].studykey}'>`;
        studyListStr +=     "<th>" + (i+1) + "</th>";
        studyListStr +=     "<th>" + response[i].pid + "</th>";
        studyListStr +=     "<th>" + response[i].panme + "</th>";
        studyListStr +=     "<th>" + response[i].modality + "</th>";
        studyListStr +=     "<th class='studyList'>" + response[i].studydesc + "</th>";
        studyListStr +=     "<th>" + response[i].studydate + "</th>";
        studyListStr +=     "<th>" + response[i].reportstatus + "</th>";
        studyListStr +=     "<th>" + response[i].seriescnt + "</th>";
        studyListStr +=     "<th>" + response[i].imagecnt + "</th>";
        studyListStr +=     "<th>" + response[i].verifyflag + "</th>";
        studyListStr += "</tr>";
    }

    const table = document.getElementById("mainTable");
    table.insertAdjacentHTML('beforeend', studyListStr);

    if (startIndex + batchSize >= totalItems) {
        $("#loadMore").remove();
    } else if ($("#loadMore").length === 0) {
        const loadMoreBtn = "<button id='loadMore'>더보기</button>";
        $("#mainTable").after("<div class='buttonContainer'></div>");
        $(".buttonContainer").append(loadMoreBtn);
    }
}


$(document).on("dblclick", "tr.subTr", function() {
        const studyinsuid = $(this).data('studyinsuid');
        const studykey = $(this).data('studykey');

        if (studyinsuid && studykey) {
            window.location.href = "/viewer/" + studyinsuid + "/" + studykey;
        } else {
            alert("Data not available");
        }
});


// $(document).on("click", "", function() {
//     const studyinsuid = $(this).data('studyinsuid');
//     const studykey = $(this).data('studykey');
//
//     if (studyinsuid && studykey) {
//         window.location.href = "/viewer/" + studyinsuid + "/" + studykey;
//     } else {
//         alert("Data not available");
//     }
// });

// 리포트
$(document).ready(function() {
    // reportstatus에 따라 입력될 값을 설정하는 함수
    function setReportInput(reportstatus) {
        const adminInput = "administrator";
        const empty = "";
        console.log("reportstatus:" + reportstatus);

        // 먼저 text3, text5, text6 값 비워주기
        $("#text3, #text5, #text6").val(empty);

        if (reportstatus === 3) {
            console.log("3번");
            $("#text3").val(adminInput);
        } else if (reportstatus === 5) {
            console.log("5번");
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
                    console.log("selectedStatus:" +selectedStatus);
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
        console.log("selectedStatus: " + selectedStatus);

        // 기존 input 요소의 값을 변경
        setReportInput(parseInt(selectedStatus));
    });
});
