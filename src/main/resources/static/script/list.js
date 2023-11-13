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


$(document).on("click", "#Dsearch", function() {
    var detailedSearch = $("#Detailed-search");

    if (detailedSearch.css('display') === 'block') {
        detailedSearch.css('display', 'none');
    } else {
        detailedSearch.css('display', 'block');
    }
});
