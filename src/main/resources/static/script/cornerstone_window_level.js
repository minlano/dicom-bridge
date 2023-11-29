/** Window Level **/
const windowLvBtn = document.getElementById('window-level');
const moveBtn = document.getElementById('move');
let isPanToolActive = false;
let isWwwcToolActive = false;

windowLvBtn.addEventListener('click', function () {
    windowLevel();
});
moveBtn.addEventListener('click', function () {
    movement_pan();
});

function windowLevel() {
    cornerstoneTools.init();

    const WwwcTool = cornerstoneTools.WwwcTool;

    if (isWwwcToolActive) {
        cornerstoneTools.setToolDisabled('Wwwc');
    } else {
        cornerstoneTools.addTool(WwwcTool);
        cornerstoneTools.setToolActive('Wwwc', {mouseButtonMask: 1});
    }
    isWwwcToolActive = !isWwwcToolActive;
}

function movement_pan() {
    cornerstoneTools.init();
    const PanTool = cornerstoneTools.PanTool;

    if (isPanToolActive) {
        cornerstoneTools.setToolDisabled('Pan');
    } else {
        cornerstoneTools.addTool(PanTool);
        cornerstoneTools.setToolActive('Pan', {mouseButtonMask: 1});
    }
    isPanToolActive = !isPanToolActive;
}