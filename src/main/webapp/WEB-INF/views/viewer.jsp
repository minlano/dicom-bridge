<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>DicomBridge</title>
    <link rel="stylesheet" href="/style/viewergrid.css">
</head>
<body>
<div id="studyInsUid" style="display: none;">${studyInsUid}</div>
<div id="viewer">
    <header>
        <h1>DicomBridge</h1>
    </header>
    <nav>
        <ul>
            <li><img src="/images/user.png"  alt="Adminstrato"> <div>Administrator</div></li>
            <li class="nav_li" id="thumbnail_btn" >
                <input type="hidden" id="studyId" value="${studyId}"/>
                <div class="image-container">
                    <img class="normal-image" src="/images/add-image.png"  alt="thumbnail">
                    <img class="hover-image" src="/images/add-image_click.png" alt="thumbnail">
                </div>
                <div>thumbnail</div>
            </li>
            <li class="nav_li" id="Toolbar_btn">
                <div class="image-container">
                    <img class="normal-image" src="/images/tools.png"  alt="Toolbar">
                    <img class="hover-image" src="/images/tools_click.png"  alt="Toolbar">
                </div>
                <div>Toolbar</div>
            </li>
            <li class="nav_li" id="Report_btn">
                <div class="Report_btn">
                    <img class="normal-image" src="/images/report.png"  alt="Report">
                    <img class="hover-image" src="/images/report_click.png"  alt="Report">
                </div>
                <div>Report</div>
            </li>
            <li id="settings_btn">
                <div class="image-container">
                    <img class="normal-image" src="/images/settings.png"  alt="settings">
                    <img class="hover-image" src="/images/settings_click.png"  alt="settings">
                </div>
            </li>
            <li id="logout_btn">
                <div class="image-container">
                    <img class="normal-image" src="/images/logout.png"  alt="logout">
                    <img class="hover-image" src="/images/logout_click.png"  alt="logout">
                </div>
            </li>
        </ul>
    </nav>

    <section id="viewer-contents">

        <!-- Report Modal -->
        <div id="reportModal" class="modal" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation();">
                <!-- 모달 내용 -->
                <span class="close" onclick="closeModal()">&times;</span>
                <div class="right-div">
                    <div id="studyContainer">
                        <c:forEach var="study" items="${studies}">
                            <div class="horizontalStudy">

                            </div>
                        </c:forEach>
                    </div>
                    <div class="cell-a"><textarea placeholder="코멘트" readonly></textarea></div>
                    <div class="cell-b">
                        <textarea name="interpretation" id="interpretation"></textarea>
                    </div>
                    <div class="cell-c">
                        <div>
                            <div>판독 매크로</div>
                            <div><select></select></div>
                        </div>
                        <div>
                            <div>Report Code</div>
                            <div id="reportStatusSelectContainer">
                                <select></select>
                            </div>
                        </div>
                        <div>
                            <div>예비판독의</div>
                            <div><input type="text" id="text5"></div>
                        </div>
                        <div>
                            <div>판독의1</div>
                            <div><input type="text" id="text3">></div>
                        </div>
                        <div>
                            <div>판독의2</div>
                            <div><input type="text"></div>
                        </div>
                        <div>
                            <button class="checkButton">판독</button>
                            <button class="checkButton">예비판독</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <aside id="toolbar">
            <ul>
                <li id="list_btn">
                    <img src="/images/worklist.0c26b996e226a3db09e77ef62d440241.png" alt="List">
                    <div>List</div>
                </li>
                <li>
                    <img src="/images/previous_study.3cb78eecd6d2385b44cb9176ba1fc87c.png" alt="이전">
                    <div>이전</div>
                </li>
                <li>
                    <img src="/images/next_study.09fbf5daceba6ace2519e74bde2e8420.png" alt="다음">
                    <div>다음</div>
                </li>
                <li>
                    <img src="/images/default.fa9b027b98a164fb3b5849c0d3ca39ca.png" alt="DefaultTool">
                    <div>Default Tool</div>
                </li>
                <li>
                    <img src="/images/wwwc.1cc5a0ecda9fd93a085688cedaa8a78b.png" alt="windowLevel">
                    <div>윈도우 레벨</div>
                </li>
                <li>
                    <img src="/images/invert.ede51ece1c3d447e625c3191b6a2af9c.png" alt="blackAndWhite">
                    <div>흑백 반전</div>
                </li>
                <li>
                    <img src="/images/pan.47e8cd9f65cf64c8f2fb3d08c6f205ab.png" alt="이동">
                    <div>이동</div>
                </li>
                <li>
                    <img src="/images/scrollloop.5508766fa02ed78f41fbf1381d8329e4.png" alt="스크롤">
                    <div>스크롤 루프</div>
                </li>
                <li>
                    <img src="/images/changeImageLayout.2294818a3aa0403736162eb1a10a89b7.png" alt="1시리즈">
                    <div>1시리즈</div>
                </li>
                <li>
                    <img src="/images/comparison.07c6226e96a236664e9ac4c5ff078c44.png" alt="비교검사">
                    <div>비교검사</div>
                </li>
                <li>
                    <img src="/images/play.6f437ab2591fe6a6c319e7e77f01df3e.png" alt="clip">
                    <div>플레이 클립</div>
                </li>
                <li>
                    <img src="/images/tools.2d1068915b14d4ae8a087ca1036b65b2.png" alt=" tool">
                    <div>도구</div>
                </li>
                <li>
                    <img src="/images/annotation.19ee74cd3ecff2134a423009b58463aa.png" alt="주석">
                    <div>주석</div>
                </li>
                <li>
                    <img src="/images/refresh.6a8fba2767a97749fd00e3e6f59935f3.png" alt="재설정">
                    <div>재설정</div>
                </li>
                <li>
                    <img src="/images/changeSeriesLayout.6c2935a8c5a52c722e1055e79e316d58.png" alt="Series">
                    <div class="tooltip" onclick="showBox('Series')">Series</div>
                    <div id="infoBox">
                        <div id="infoContent">
                            <ul>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                            </ul>
                            <ul>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                            </ul>
                            <ul>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                            </ul>
                            <ul>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                            </ul>
                            <ul>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                                <div><img src="/images/blank_box.png"></div>
                            </ul>
                        </div>
                    </div>
                </li>
                <li>
                    <img src="/images/changeSeriesLayout.6c2935a8c5a52c722e1055e79e316d58.png" alt="Layout">
                    <div>이미지레이아웃</div>
                </li>
            </ul>
        </aside>
        <section id="thumbnail-container" style="display: none">
            <div class="table-wrapper">
                <table>
                    <thead><tr><th>thumbnail</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        </section>
        <section id="image-container">
<%--            <div class="image">--%>
<%--                <img src="/images/화면 캡처 2023-11-07 104120.png" alt="이미지1">--%>
<%--            </div>--%>
<%--            <div class="image">--%>
<%--                <img src="/images/화면 캡처 2023-11-07 104120.png" alt="이미지2">--%>
<%--            </div>--%>
<%--            <div class="image">--%>
<%--                <img src="/images/화면 캡처 2023-11-07 104120.png" alt="이미지3">--%>
<%--            </div>--%>
<%--            <div class="image">--%>
<%--                <img src="/images/화면 캡처 2023-11-07 104120.png" alt="이미지4">--%>
<%--            </div>--%>
        </section>
    </section>
</div>
</body>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://unpkg.com/cornerstone-core"></script>
<script src="https://unpkg.com/cornerstone-wado-image-loader"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="/script/dicomParser.js"></script>
<script src="/script/viewer.js"></script>
<script src="/script/seriesImageLoad.js"></script>
</html>
