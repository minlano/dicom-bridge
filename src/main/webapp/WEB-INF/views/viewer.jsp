<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>DicomBridge</title>
    <link rel="stylesheet" href="/style/viewergrid.css">
    <link rel="icon" href="/images/favicon_logo.png" sizes="16x16" type="image/png">
</head>
<body>
<div id="studyInsUid" style="display: none;">${studyInsUid}</div>
<div id="viewer">
    <header>
        <img src="/images/dicombridge_logo.png" alt="logo" id="title_btn" style="width: 350px;">
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
        <div id="reportModal" class="modal" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation();">
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
        <div id="comparisonModal" class="modal">
            <div id="comparisonGrid" class="modal-content">
                <header id="comparisonHeader">
                    <span id = "comparisonExit"class="close" onclick="closeComparisonModal()">&times;</span>
                    <aside id="study-search">
                        <div class="search-bar">
                            <a class="subtitle">검색</a>
                        </div>
                        <ul>
                            <li class="nohover"><input type="text" class="keyword" id="Pid-input" placeholder="환자 아이디">
                                <input type="text" class="keyword" id="Pname-input" placeholder="환자 이름">
                                <select id="category" class="keyword">
                                    <option value="">판독상태</option>
                                    <option value="3">읽지않음</option>
                                    <option value="4">열람중</option>
                                    <option value="5">예비판독</option>
                                    <option value="6">판독</option>
                                </select>
                                <button id="search">검색</button>
                            </li>
                        </ul>
                    </aside>
                </header>
                <div id="comparisonTable" class="comparisonTable">
                    <div class="search-bar">
                        <a class="subtitle">WorkList</a>
                    </div>
                    <table id="modalComparisonTable" class="modalcomparisonTable">
                        <thead id="header-container" class="header-container">
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
                      </tr>
                      </thead>
                    </table>
                 </div>
                <footer id="comparisonFooter">
                    <div class="table-div" class="comparisonTable">
                        <div class="search-bar">
                            <a class="subtitle">Previous</a>
                        </div>
                        <table id="comparisonPreviousTable" class="modalcomparisonTable">
                            <thead class="header-container">
                            <tr>
                                <th>환자이름</th>
                                <th>검사장비</th>
                                <th class="study">검사설명</th>
                                <th>검사일시</th>
                                <th>시리즈</th>
                                <th>이미지</th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                </footer>
            </div>
        </div>

        <aside id="toolbar">
            <ul>
                <li id="list_btn">
                    <img src="/images/worklist.0c26b996e226a3db09e77ef62d440241.png" alt="List">
                    <div>List</div>
                </li>
                <li id="window-level">
                    <img src="/images/wwwc.1cc5a0ecda9fd93a085688cedaa8a78b.png" alt="windowLevel">
                    <div>윈도우 레벨</div>
                </li>
                <li id="invert">
                    <img src="/images/invert.ede51ece1c3d447e625c3191b6a2af9c.png" alt="blackAndWhite">
                    <div>흑백 반전</div>
                </li>
                <li id="move">
                    <img src="/images/pan.47e8cd9f65cf64c8f2fb3d08c6f205ab.png" alt="이동">
                    <div>이동</div>
                </li>
                <li id="comparison">
                    <img src="/images/comparison.07c6226e96a236664e9ac4c5ff078c44.png" alt="비교검사">
                    <div>비교검사</div>
                </li>
                <li class="tool" onclick="showToolBox()">
                    <img class="tool" src="/images/tools.2d1068915b14d4ae8a087ca1036b65b2.png" alt=" tool">
                    <div class="tool">도구</div>
                    <div id="toolBox">
                        <div id="toolContent">
                            <ul>
                                <div onclick="activateMagnify()">
                                    <img src="/images/magnify.233d000e41a3ad1cf9707d94950e6158.png">돋보기</div>
                                <div onclick="activateZoom()">
                                    <img src="/images/zoom.b259899b24b710fa9f31e433cc5b4e7e.png">확대축소</div>
                            </ul>
                            <ul>
                                <div onclick="activateRotate()">
                                    <img src="/images/rotate.94c480f210401d6f6adabcf17115d1e5.png">회전</div>
                                <div id="rRotate" onclick="activateFlipRotate()">
                                    <img src="/images/rightRotate.053a9e994df6b6be59bb0c3d702741e6.png">오른쪽 회전</div>
                            </ul>
                            <ul>
                                <div id="lRotate" onclick="activateFlipRotate()">
                                    <img src="/images/leftRotate.8a64a37656bf3e1a3eba2c1d82b98c7d.png">왼쪽 회전</div>
                                <div id="hFlip" onclick="activateFlipRotate()">
                                    <img src="/images/hFlip.80d6a0b3bd0b788f42da409f5d115877.png">수평 뒤집기</div>
                            </ul>
                            <ul>
                                <div id ="vFlip" onclick="activateFlipRotate()">
                                    <img src="/images/vFlip.1a75c203d6207c94829eb64a96bf952b.png">수직 대칭 이동</div>

                            </ul>

                        </div>
                    </div>
                </li>
                <li class="annotation" onclick="showAnnotationBox()">
                    <img class="annotation" src="/images/annotation.19ee74cd3ecff2134a423009b58463aa.png" alt="annotation">
                    <div class="annotation">주석</div>
                    <div id="annotationBox">
                        <div id="annotationContent">
                            <ul>
                                <div id="activateAngle" onclick="activateAngle()">
                                    <img src="/images/angle.1e52dac1b36046ae8e3b17f7212d09e3.png">각도</div>
                                <div onclick="activateArrowAnnotate()">
                                    <img src="/images/arrowAnnotate.3b3e8aff47cbcad5127d6ef07404f4e3.png">화살표</div>
                            </ul>
                            <ul>
                                <div onclick="activateProbe()">
                                    <img src="/images/probe.c1bbaff5b3a138e4d0a91ed67b54bc2d.png">Probe</div>
                                <div onclick="activateLength()">
                                    <img src="/images/length.62b344c23d7eb391d08d2ece39f69926.png">길이</div>
                            </ul>
                            <ul>
                                <div onclick="activateRectangleROI()">
                                    <img src="/images/rectangleROI.6d28dc65ff156314a3f7679742611563.png">사각형 그리기</div>
                                <div onclick="activateEllipticalROI()">
                                    <img src="/images/ellipticalROI.75a48af081b131624797edd4373c1b22.png">원 그리기</div>
                            </ul>
                            <ul>
                                <div onclick="activateFreeHand()">
                                    <img src="/images/freeHand.ccc90ff2cacb2a39f092e59689485f92.png">자율 그리기</div>
                                <div onclick="activateBidirectional()">
                                    <img src="/images/bidirectional.9a08aab170feb4e1ede185075f4fdaa6.png">Bidirectional</div>
                            </ul>
                            <ul>
                                <div onclick="activateCobbAngle()">
                                    <img src="/images/cobbAngle.1b412c3001b7d430c1064115fe845d79.png">콥 각도</div>
                                <div onclick="activateTextMarker()">
                                    <img src="/images/textMarker.c203289c93466e8a10569367935d8b07.png">텍스트 마커</div>
                            </ul>
                            <ul>
                                <div onclick="activateEraser()">
                                    <img src="/images/eraser.bf8a01d63d3fddbbe86da109fdaa188b.png">선택 삭제</div>
                            </ul>
                        </div>
                    </div>
                </li>
                <li id="reset">
                    <img src="/images/refresh.6a8fba2767a97749fd00e3e6f59935f3.png" alt="재설정">
                    <div>재설정</div>
                </li>
                <li id="seriesInfoBox" class="info" onclick="showInfoBox()">
                    <img class="info" src="/images/changeSeriesLayout.6c2935a8c5a52c722e1055e79e316d58.png">
                    <div class="info">Series</div>
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
        </section>
        <section id="image-container2">
        </section>
    </section>
</div>
</body>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8"></script>
<script src="https://cdn.jsdelivr.net/npm/cornerstone-core/dist/cornerstone.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cornerstone-math@0.1.10/dist/cornerstoneMath.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cornerstone-tools@6.0.10/dist/cornerstoneTools.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cornerstone-web-image-loader@2.1.1/dist/cornerstoneWebImageLoader.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@4.13.2/dist/cornerstoneWADOImageLoader.bundle.min.js"></script>
<script src="/script/cornerstoneDicomParserUTF8.js"></script>
<script src="/script/cornerstone_window_level.js"></script>
<script src="/script/cornerstone_annotation.js"></script>
<script src="/script/cornerstone_invert.js"></script>
<script src="/script/cornerstone_tool.js"></script>
<script src="/script/comparison.js"></script>
<script src="/script/imageLoad.js"></script>
<script src="/script/viewer.js"></script>
<script src="/script/report.js"></script>
</html>