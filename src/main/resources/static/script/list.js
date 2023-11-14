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

/****************************************
 ********************값넘기는거 확인********
 ****************************************/
// $(document).on("dblclick", "tr.subTr", function() {
//         const studyinsuid = $(this).data('studyinsuid');
//         const studykey = $(this).data('studykey');
//
//         if (studyinsuid && studykey) {
//             window.location.href = "/viewer/" + studyinsuid + "/" + studykey;
//         } else {
//             alert("Data not available");
//         }
// });

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
/****************************************
********************값넘기는거 확인********
 ****************************************/




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
















