let startIndex = 0;
const batchSize = 10;
let totalItems = 0;

$("#search").click(function() {
    $('#mainTable tr:gt(0)').remove(); // 첫번쨰 tr 제외하고 삭제
    $('#previousTable tr:gt(0)').remove();
    startIndex = 0; // 검색 버튼 클릭 시 startIndex 초기화
    fetchItems(startIndex, batchSize);
});

$(document).on("click", "#loadMore", function() {
    startIndex += batchSize; // 다음 페이지의 시작 인덱스로 업데이트
    fetchItems(startIndex, batchSize);
});

function fetchItems(startIndex, batchSize) {
    $.ajax({
        url: "/study-list",
        data: { startIndex: startIndex, batchSize: batchSize },
        success: function(response) {
            totalItems = response.length; // 전체 수
            $('#studyCount').text(totalItems);
            displayItems(response, startIndex, batchSize, totalItems);
            previous(response);
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
        studyListStr +=     "<td>" + (i+1) + "</td>";
        studyListStr +=     "<td class='pid'>" + response[i].pid + "</td>";
        studyListStr +=     "<td class='pname'>" + response[i].pname + "</td>";
        studyListStr +=     "<td>" + response[i].modality + "</td>";
        studyListStr +=     "<td class='studyList'>" + response[i].studydesc + "</td>";
        studyListStr +=     "<td>" + response[i].studydate + "</td>";
        studyListStr +=     "<td>" + response[i].reportstatus + "</td>";
        studyListStr +=     "<td>" + response[i].seriescnt + "</td>";
        studyListStr +=     "<td>" + response[i].imagecnt + "</td>";
        studyListStr +=     "<td>" + response[i].verifyflag + "</td>";
        studyListStr += "</tr>";
    }

    const table = document.getElementById("mainTable");
    table.insertAdjacentHTML('beforeend', studyListStr);

    if (startIndex + batchSize >= totalItems) {
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
            window.location.href = "/viewer/" + studyinsuid + "/" + studykey;
        } else {
            alert("Data not available");
        }
});



// 리포트
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
            },
            error: function() {
                alert("Error fetching reportstatus");
            }
        });
    } else {
        alert("Data not available");
    }
});


//세부검색
$(document).on("click", "#Dsearch", function() {
    var detailedSearch = $("#Detailed-search");

    if (detailedSearch.css('display') === 'block') {
        detailedSearch.css('display', 'none');
    } else {
        detailedSearch.css('display', 'block');
    }
});


//click - Previous 동일한 환자 정보 불러오기
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


/* 검색 */
    // $(document).on("click", "#search", function () {
    //     var pid = $('#Pid-input').val();
    //     var pname = $('#Pname-input').val();
    //     var reportstatus = $('#category').val(); // 수정된 부분
    //
    //     if (pid !== "" || pname !== "" || reportstatus !== ""){
    //         $.ajax({
    //             url: "/search-list", // 적절한 엔드포인트를 사용해야 함
    //             method: "GET",
    //             data: { pid: pid, pname: pname, reportstatus: reportstatus }, // pname 추가
    //             success: function(response) {
    //                 totalItems = response.length; // 전체 아이템 수
    //                 $('#studyCount').text(totalItems);
    //                 displayItems(response, startIndex, batchSize, totalItems);
    //             },
    //             error: function() {
    //                 alert("Error fetching reportstatus");
    //             }
    //         });
    //     }
    //
    // });
















