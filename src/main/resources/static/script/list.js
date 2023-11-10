$(document).ready(function() {

    $("#search").click(function() {
        $.ajax({
            url: "/study-list",
            async: true,
            success: function(response) {
                $(".subTr").remove();
                let studyListStr = "";
                for(let i=0; i<response.length; i++) {
                    studyListStr += "<tr class='subTr' id='" + response[i].studyinsuid + "'>";
                    studyListStr +=     "<th>" + (i+1) + "</th>";
                    studyListStr +=     "<th>" + response[i].pid + "</th>";
                    studyListStr +=     "<th>" + response[i].panme + "</th>";
                    studyListStr +=     "<th>" + response[i].modality + "</th>";
                    studyListStr +=     "<th className='wide-cell'>" + response[i].studydesc + "</th>";
                    studyListStr +=     "<th>" + response[i].studydate + "</th>";
                    studyListStr +=     "<th>" + response[i].reportstatus + "</th>";
                    studyListStr +=     "<th>" + response[i].seriescnt + "</th>";
                    studyListStr +=     "<th>" + response[i].imagecnt + "</th>";
                    studyListStr +=     "<th>" + response[i].verifyflag + "</th>";
                    studyListStr += "</tr>";

                    imagePageWithStudyinsuid(response[i].studyinsuid);
                }
                const table = document.getElementById("mainTable");
                table.getElementsByTagName("tr")[0].insertAdjacentHTML('afterend', studyListStr);
            },
            error: function() {
                alert("Error Occur!")
            }
        })
    })

    function imagePageWithStudyinsuid(studyinsuid) {
        $(document).on("click", document.getElementById(studyinsuid), function() {
            window.location.href = "/viewer/" + studyinsuid;
        });
    }
})