<%--
  Created by IntelliJ IDEA.
  User: TJ
  Date: 2023-11-07
  Time: 오후 3:56
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="/style/listgrid.css">
    <title>Dicom-bridge</title>
</head>
<body>
<div id="container">
    <header>
        <h1>DicomBridge</h1>
    </header>

    <section id="bar-container">
        <nav>
            <ul>
                <li><img src="/images/user.png"  alt="Adminstrato"> <div>Administrator</div></li>
                <li class="nav_li" id="Dsearch" >
                    <div class="image-container">
                        <img class="normal-image" src="/images/search.png"  alt="thumbnail">
                        <img class="hover-image" src="/images/search_click.png" alt="thumbnail">
                    </div>
                    <div>세부검색</div>
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

        <aside id="Detailed-search" style="display: none;">
            <ul>
                <li><div id="calender"></div></li>
                <li>
                    <span>검사일자</span>
                </li>
                <li>
                    <span>검사장비</span>
                </li>
                <li>
                    <span>Verify</span>
                </li>
                <li>
                    <button>조회</button>
                    <button>재설정</button>
                </li>
            </ul>
        </aside>

    </section>

    <section id="list-contents">

        <aside id="study-search">
            <div id="search-bar">
                <a class="subtitle">검색</a>
            </div>
            <ul>
                <li><input type="text" class="keyword" id="Pid-input" placeholder="환자 아이디">
                    <input type="text" class="keyword" id="Pname-input" placeholder="환자 이름">
                    <select id="category" class="keyword">
                        <option value="전체">판독상태</option>
                        <option value="읽지않음">읽지않음</option>
                        <option value="열람중">열람중</option>
                        <option value="예비판독">예비판독</option>
                        <option value="판독">판독</option>
                    </select>
                    <button id="search" >검색</button></li>
                <li>전체</li>
                <li>1일</li>
                <li>3일</li>
                <li>1주일</li>
                <li>재설정</li>
            </ul>
            <div id="search-result">
                <a class="subtitle">총 검사 건수 : </a>
                <button>다운로드</button>
                <button>검사삭제</button>
                <select>
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                    <option value="100">100개씩 보기</option>
                </select>
            </div>
        </aside>
        <section id="mainContent">
            <table  id="mainTable">
                <tr id="trTitle">
                    <th>번호</th>
                    <th>환자 아이디</th>
                    <th>환자 이름</th>
                    <th>검사장비</th>
                    <th class="study">검사설명</th>
                    <th>검사일시</th>
                    <th>판독상태</th>
                    <th>시리즈</th>
                    <th>이미지</th>
                    <th>Verify</th>
                </tr>
            </table>
        </section>
        <footer>
            <div class="left-div">
                <div>
                    <li class="subtitle">Previous</li>
                </div>
                <div>
                    <li>환자 아이디 : </li>
                    <li>환자 이름 : </li>
                </div>
                <div>
                    <table id="previousTable">
                        <tr>
                            <td>검사장비</td>
                            <td>검사설명</td>
                            <td>검사일시</td>
                            <td>판독상태</td>
                            <td>시리즈</td>
                            <td>이미지</td>
                            <td>Verify</td>
                        </tr>
                        <tr>
                            <td>데이터 1</td>
                            <td>데이터 2</td>
                            <td>데이터 3</td>
                            <td>데이터 4</td>
                            <td>데이터 5</td>
                            <td>데이터 6</td>
                            <td>데이터 7</td>
                        </tr>
                        <tr>
                            <td>데이터 1</td>
                            <td>데이터 2</td>
                            <td>데이터 3</td>
                            <td>데이터 4</td>
                            <td>데이터 5</td>
                            <td>데이터 6</td>
                            <td>데이터 7</td>
                        </tr>
                        <tr>
                            <td>데이터 1</td>
                            <td>데이터 2</td>
                            <td>데이터 3</td>
                            <td>데이터 4</td>
                            <td>데이터 5</td>
                            <td>데이터 6</td>
                            <td>데이터 7</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="right-div">
                <div class="subtitleAndButton"><a class="subtitle">Report</a> <button class="checkButton">판독 지우기</button></div>
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
        </footer>
    </section>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="/script/list.js"></script>
</body>
</html>
