/** Comparison **/
var modality = localStorage.getItem("modality");
var pname = localStorage.getItem("pname");
var pid = localStorage.getItem("pid");
var comparison = document.getElementById('comparison');
let comparisonFalse = true;
comparison.addEventListener(('click'), function (e) {
    if (comparisonFalse === false) {
        return handleComparisonTrueChangeEvent()
    }

    //alert(modality);
    $.ajax({
        url: "/comparison-study-list",
        method: "GET",
        data: {modality: modality},
        success: function (response) {
            comparisonList(response);
        },
        error: function () {
            alert("Error Occur!!");
        }
    });

    $.ajax({
        url: "/study/list",
        success: function (response) {
            comparisonPrevious(response);
        },
        error: function () {
            alert("Error Occur!");
        }
    });
    openComparisonModal();
})

function comparisonList(response) {
    //modal창에 출력
    let comparisonListStr = "";
    comparisonListStr += `
        <tr id="trTitle">
            <th>번호</th>
            <th>환자 아이디</th>
            <th>환자 이름</th>
            <th>검사장비</th>
            <th class="study">검사설명</th>
            <th>검사일시</th>
            <th>시리즈</th>
            <th>이미지</th>
            <th>Verify</th>
        </tr>`;
    for (let i = 0; i < response.length; i++) {
        comparisonListStr += `<tr class='subTr' data-studyinsuid='${response[i].studyinsuid}' data-studykey='${response[i].studykey}' data-modality='${response[i].modality}'>`;
        comparisonListStr += "<td>" + (i + 1) + "</td>";
        comparisonListStr += "<td class='pid'>" + response[i].pid + "</td>";
        comparisonListStr += "<td class='pname'>" + response[i].pname + "</td>";
        comparisonListStr += "<td>" + response[i].modality + "</td>";
        comparisonListStr += "<td class='studyList'>" + response[i].studydesc + "</td>";
        comparisonListStr += "<td>" + response[i].studydate + "</td>";
        comparisonListStr += "<td>" + response[i].seriescnt + "</td>";
        comparisonListStr += "<td>" + response[i].imagecnt + "</td>";
        comparisonListStr += "<td>" + response[i].verifyflag + "</td>";
        comparisonListStr += "</tr>";
    }
    const table = document.getElementById("modalComparisonTable");
    table.innerHTML = "";
    table.insertAdjacentHTML('beforeend', comparisonListStr);
}

function comparisonPrevious(response) {
    let comparisonPreviousListStr = "";
    comparisonPreviousListStr += `
                            <tr>
                                <th>환자이름</th>
                                <th>검사장비</th>
                                <th class="study">검사설명</th>
                                <th>검사일시</th>
                                <th>시리즈</th>
                                <th>이미지</th>
                            </tr>`;
    for (let i = 0; i < response.length; i++) {
        if (pid === response[i].pid) {
            comparisonPreviousListStr += `<tr class='subTr' data-studyinsuid='${response[i].studyinsuid}' data-studykey='${response[i].studykey}'>`;
            comparisonPreviousListStr += "<td>" + pname + "</td>";
            comparisonPreviousListStr += "<td>" + response[i].modality + "</td>";
            comparisonPreviousListStr += "<td>" + response[i].studydesc + "</td>";
            comparisonPreviousListStr += "<td>" + response[i].studydate + "</td>";
            comparisonPreviousListStr += "<td>" + response[i].seriescnt + "</td>";
            comparisonPreviousListStr += "<td>" + response[i].imagecnt + "</td>";
            comparisonPreviousListStr += "</tr>";
        }
    }
    const table = document.getElementById("comparisonPreviousTable");
    table.innerHTML = "";
    table.insertAdjacentHTML('beforeend', comparisonPreviousListStr);
}

function closeComparisonModal() {
    var modal = document.getElementById("comparisonModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

function openComparisonModal() {
    var comparisonModal = document.getElementById("comparisonModal");
    comparisonModal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function ComparisonCss() {
    if (!comparisonFalse) {
        if (isThumbnailVisible) {
            $("#image-container").css({
                "width": "45%",
                "float": "left",
                "overflow": "auto"
            });
            $("#image-container2").css({
                "width": "45%",
                "display": "grid",
                "float": "right"
            });
        } else {
            $("#image-container").css({
                "width": "40%",
                "float": "left",
                "overflow": "auto"
            });
            $("#image-container2").css({
                "width": "40%",
                "display": "grid",
                "float": "right"
            });
        }
    }
}

function ComparisonInnerCss(){
    $(".cornerstone-canvas").css({
        "width": "40%",
    });
}

function ComparisonChange(){
    var index = 0;
    imageDisplay();

    var modal = document.getElementById("comparisonModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";

    imageContainer2.style.gridTemplateRows = `repeat(2, 1fr)`;
    imageContainer2.style.gridTemplateColumns = `repeat(2, 1fr)`;
    imageDisplayComparison(studyinsuidComparison);

    $(".cornerstone-canvas").css({
        "width": "100%",
        "height": "100%"
    });
}

$(document).on("dblclick", "tr.subTr", function () {
    comparisonFalse = false;
    ComparisonCss();
    studyinsuidComparison = $(this).data('studyinsuid');
    ComparisonChange()
});

async function imageDisplayComparison(studyinsuidComparison) {
    while (imageContainer2.firstChild)
        imageContainer2.removeChild(imageContainer2.firstChild);

    var index = 0;
    seriesInsUids = await findSeriesInsUidByStudyInsUidComparison(studyinsuidComparison);
    seriesInsUids.length
    for (var i = 0; i < rowCol.row; i++) {
        for (var j = 0; j < rowCol.col; j++) {
            var div = document.createElement('div');
            var id = `image2_${i}_${j}`;
            div.id = id;
            div.style.height = '100%';
            div.style.width = '100%';

            div.setAttribute('order', FIRST_ORDER);
            imageContainer2.appendChild(div);

            createWheelHandlerComparison(id, seriesInsUids[index]);

            if (index < seriesInsUids.length) {
                await viewDicomBySeriesInsUidComparison(id, seriesInsUids[index], COMPARISON_FIRST_ORDER);
                createBoxHandler(id, seriesInsUids[index]);
            }
            index++;
        }
    }
}

async function findSeriesInsUidByStudyInsUidComparison(studyinsuidComparison) {
    try {
        let response = await axiosInstance.get("/studies/getSeriesInsUidsComparison/" + studyinsuidComparison);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
}

async function viewDicomBySeriesInsUidComparison(id, seriesInsUid, order) {
    let whereDiv = 2;
    try {
        let response = await axiosInstance.get("/studies/getSeriesInsUidIndexComparison/" + seriesInsUid + "/" + order, {responseType: 'arraybuffer'});
        if (response.status === 200)
            await displayDicomImage(response.data, id, seriesInsUid, order, whereDiv);
    } catch (error) {
        console.error(error);
    }
}

function handleComparisonTrueChangeEvent() {
    $("#image-container").css({
        "width": "",
        "float": ""
    });
    $("#image-container2").css({
        "display": "none",
        "float": "right"
    });
    $(".cornerstone-canvas").css({
        "width": "100%",
        "height": "100%"
    });
    comparisonFalse = true;
    imageDisplay();
}

function createWheelHandlerComparison(id, seriesInsUid) {
    var individualDiv = document.getElementById(id);
    individualDiv.addEventListener('wheel', function (event) {
        handleScrollComparison(event, id, seriesInsUid);
    });
}

async function handleScrollComparison(event, id, seriesInsUid) {
    var individualDiv = document.getElementById(id);
    var order = parseInt(individualDiv.getAttribute('order'), 10) || COMPARISON_FIRST_ORDER;
    let maxOrder = await countBySeriesInsUid(seriesInsUid);
    let scrollAmount = event.deltaY > 0 ? -1 : 1;

    order += scrollAmount;
    if (order < COMPARISON_FIRST_ORDER || order >= maxOrder)
        order = COMPARISON_FIRST_ORDER;

    individualDiv.setAttribute('order', order);
    await viewDicomBySeriesInsUidComparison(id, seriesInsUid, order);
}

let startIndex = 0;
const batchSize = 10;
let totalItems = 0;


$(document).on("click", "#search", function () {

    $('#mainTable tr:gt(0)').remove(); // 첫번째 tr 제외하고 삭제
    $('#previousTable tr:gt(0)').remove();
    startIndex = 0; // 검색 버튼 클릭 시 startIndex 초기화

    const pid = $('#Pid-input').val();
    const pname = $('#Pname-input').val();
    const reportstatus = $('#category').val();

    fetchDataSomehow(pid, pname, reportstatus, startIndex, batchSize);

});

$(document).on("click", "#searchAll", function () {

    $('#mainTable tr:gt(0)').remove(); // 첫번째 tr 제외하고 삭제
    $('#previousTable tr:gt(0)').remove();
    startIndex = 0; // 검색 버튼 클릭 시 startIndex 초기화
    previousItems();

    $('#Pid-input').val('');
    $('#Pname-input').val('');
    $('#category').val('');

    fetchDataSomehow('', '', '', startIndex, batchSize);

});

/** Enter **/
$(document).on("keypress", function (event) {
    if (event.which === 13 || event.keyCode === 13) {
        $('#modalComparisonTable tr:gt(0)').remove(); // 첫번째 tr 제외하고 삭제
        startIndex = 0; // 검색 버튼 클릭 시 startIndex 초기화

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
        data: {pid: pid, pname: pname, reportstatus: reportstatus, startIndex: startIndex, batchSize: batchSize},
        success: function (response) {
            totalItems = response.length; // 전체 아이템 수
            $('#studyCount').text(totalItems);
            comparisonList(response);
        },
        error: function () {
            alert("Error fetching reportstatus");
        }
    });
}