document.addEventListener("DOMContentLoaded", function() {
    // Report_btn 클릭 시 모달 열기
    document.getElementById("Report_btn").addEventListener("click", function() {
        openModal();
    });
});

function openModal() {
    // 모달 열기
    var modal = document.getElementById("reportModal");
    modal.style.display = "block";

    // 바디 스크롤 막기
    document.body.style.overflow = "hidden";
}

function closeModal() {
    // 모달 닫기
    var modal = document.getElementById("reportModal");
    modal.style.display = "none";

    // 바디 스크롤 허용
    document.body.style.overflow = "auto";
}


$(document).ready(function() {
    // reportstatus에 따라 입력될 값을 설정하는 함수


    // 클릭 이벤트에 reportstatus를 받아와서 처리하는 코드
    $(document).on("click", ".Report_btn", function() {

        let studykey = document.getElementById("studyId").value;
        console.log("stk:" +studykey);

        if (studykey) {
            // studyContainer 내용 비우기
            $("#studyContainer").empty();
            $.ajax({
                url: "/getStudies/" + studykey,
                method: "GET",
                success: function(studiesResponse) {
                    // 서버로부터 받은 studies를 기반으로 화면 업데이트
                    if (studiesResponse) {
                        updateStudiesOnPage(studiesResponse);
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
                        alert("Error fetching studies");
                    }
                },
                error: function() {
                    alert("Error fetching studies");
                }
            });
        } else {
            alert("Data not available");
        }
    });



    // updateStudiesOnPage 함수의 예시 구현
    function updateStudiesOnPage(studies) {
        // studies를 순회하면서 각 study 정보를 HTML에 추가
        for (const study of studies) {
            // study 정보를 이용하여 HTML 생성

            const studyInfoHtml = `
            <!-- 각 study 정보를 수평으로 표시 -->
                <span>환자정보: ${study.pname} / ${study.pid} / ${study.pbirthdatetime}</span><br>
                <span>검사날짜: ${study.studydate} <span class="studytime">${study.studytime}</span> </span><br>
                <span>검사명: ${study.studydesc}</span>
                <div class="subtitleAndButton">
                    <button class="deleteButton">판독 지우기</button>
                </div>
        `;

            // 생성한 HTML을 해당 부분에 추가
            $("#studyContainer").append(studyInfoHtml);
        }
    }
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
    // reportstatus 값이 변경될 때 호출되는 이벤트 처리
    $(document).on("change", "#reportStatusSelectContainer select", function() {
        const selectedStatus = $(this).val();
        console.log("selectedStatus: " + selectedStatus);

        // 기존 input 요소의 값을 변경
        setReportInput(parseInt(selectedStatus));
    });
});