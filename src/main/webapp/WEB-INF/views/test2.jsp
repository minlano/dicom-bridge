<%--
  Created by IntelliJ IDEA.
  User: TJ
  Date: 2023-11-06
  Time: 오후 2:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/css/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">


    <title>list</title>
</head>

<body>
<header>
    <div class="logo">로고</div>

</header>

<main>
    <div class="search-bar">
        <input type="text" placeholder="검색어를 입력하세요">
        <button>검색</button>
    </div>
    <div class="search-results">
        <!-- 검색 결과가 여기에 동적으로 추가됩니다 -->
    </div>

    <div class="previous-searches">
        <h2>이전 검사 기록</h2>
        <ul>
            <!-- 이전 검사 기록이 여기에 동적으로 추가됩니다 -->
        </ul>
    </div>

    <div class="comment-section">
        <h2>코멘트</h2>
        <div class="comments">
            <!-- 코멘트가 여기에 동적으로 추가됩니다 -->
        </div>
    </div>

    <div class="sidebar">
        <!-- 사이드바 내용이 여기에 들어갑니다 -->
    </div>
</main>
</body>

</html>
