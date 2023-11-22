var toolBox = document.getElementById('toolBox');

function showToolBox() {
    toolBox.style.display = 'inline-block';
}

window.addEventListener('click', function (e) {
    if(e.target.className !== 'tool')
        toolBox.style.display = 'none';
})