<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .box {
            width: 500px;
            height: 500px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            border: 1px solid black; /* .box에 테두리 추가 */
        }

        .unvisible {
            display: none;
            border: 1px solid black; /* border 추가 */
        }

        .visible {
            display: block;
            border: 2px solid red; /* visible 클래스가 적용된 div에는 크게 표시되도록 스타일 추가 */
            box-sizing: border-box; /* border를 포함한 크기로 지정 */
            width: 100%; /* 부모 .box의 크기에 맞게 width 100%로 설정 */
            height: 100%; /* 부모 .box의 크기에 맞게 height 100%로 설정 */
        }
    </style>
</head>
<body>

<div class="box">
    <div class="unvisible"></div>
    <div class="unvisible"></div>
    <div class="unvisible"></div>
    <div class="unvisible"></div>
</div>

<button value="1x1" onclick="showDivs(1)">1x1</button>
<button value="2x2" onclick="showDivs(2)">2x2</button>

<script>
    function showDivs(num) {
        var divs = document.querySelectorAll('.box .unvisible');

        // 모든 div를 초기화
        divs.forEach(function(div) {
            div.classList.remove('visible');
        });

        // 선택한 개수만큼 div를 보이도록 설정
        for (var i = 0; i < num; i++) {
            divs[i].classList.add('visible');
        }
    }
</script>

</body>
</html>