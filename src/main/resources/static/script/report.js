document.addEventListener("DOMContentLoaded", function() {
    // Report_btn 클릭 시 모달 열기
    var ReportBtn = document.getElementById("Report_btn")
    ReportBtn.addEventListener("click", function() {
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

                        $.ajax({
                            url: "/getReportStatus",
                            method: "GET",
                            data: { studykey: studykey },
                            success: function(response) {

                                const reportStatusSelect = $("<select>");

                                for (const status of response) {
                                    reportStatusSelect.append(`<option value="${status}">${status}</option>`);
                                }

                                $("#reportStatusSelectContainer").empty().append(reportStatusSelect);

                                const selectedStatus = reportStatusSelect.val();
                                console.log("selectedStatus:" +selectedStatus);
                                setReportInput(parseInt(selectedStatus));

                                $.ajax({
                                    url: "/getInterpretation",
                                    method: "GET",
                                    data: { studykey: studykey },
                                    success: function(interpretationResponse) {

                                        const interpretationValue = interpretationResponse.length > 0 ? interpretationResponse[0] : '';

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

    function updateStudiesOnPage(studies) {
        for (const study of studies) {
            const studyInfoHtml = `
                <span>환자정보: ${study.pname} / ${study.pid} / ${study.pbirthdatetime}</span><br>
                <span>검사날짜: ${study.studydate} <span class="studytime">${study.studytime}</span> </span><br>
                <span>검사명: ${study.studydesc}</span>
                <div class="subtitleAndButton">
                    <button class="deleteButton">판독 지우기</button>
                </div>
            `;

            $("#studyContainer").append(studyInfoHtml);
        }
    }
    function setReportInput(reportstatus) {
        const adminInput = "administrator";
        const empty = "";
        console.log("reportstatus:" + reportstatus);

        $("#text3, #text5, #text6").val(empty);
        if (reportstatus === 6) {
            console.log("3번");
            $("#text3").val(adminInput);
        } else if (reportstatus === 5) {
            console.log("5번");
            $("#text5").val(adminInput);
        } else if (reportstatus === 3) {
            $("#text6").val(empty);
        }
    }

    $(document).on("change", "#reportStatusSelectContainer select", function() {
        const selectedStatus = $(this).val();
        console.log("selectedStatus: " + selectedStatus);

        setReportInput(parseInt(selectedStatus));
    });
});