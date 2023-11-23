/* cornerstoneTool */
cornerstoneTools.init();
var toolBox = document.getElementById('toolBox');

function showToolBox() {
    toolBox.style.display = 'inline-block';
}

window.addEventListener('click', function (e) {
    if(e.target.className !== 'tool')
        toolBox.style.display = 'none';
})
function activateMagnify() {
    const MagnifyTool = cornerstoneTools.MagnifyTool;

    cornerstoneTools.addTool(MagnifyTool)
    cornerstoneTools.setToolActive('Magnify', { mouseButtonMask: 1 })
}

function activateZoom() {
    const ZoomTool = cornerstoneTools.ZoomTool

    cornerstoneTools.addTool(cornerstoneTools.ZoomTool, {
        // Optional configuration
        configuration: {
            invert: false,
            preventZoomOutsideImage: false,
            minScale: .1,
            maxScale: 20.0,
        }
    });

    cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 })
}

function activateRotate() {
    const RotateTool = cornerstoneTools.RotateTool

    cornerstoneTools.addTool(RotateTool)
    cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 1 })
}

function activateFlipRotate(element) {
    //cornerstone.reset(element);

    // 이벤트 핸들러 등록
    document.getElementById('hFlip').onclick = function () {
        flipHandler('hflip');
    };

    document.getElementById('vFlip').onclick = function () {
        flipHandler('vflip');
    };

    document.getElementById('lRotate').onclick = function () {
        rotateHandler(-90);
    };

    document.getElementById('rRotate').onclick = function () {
        rotateHandler(90);
    };

    function flipHandler(flipType) {
        const viewport = cornerstone.getViewport(element);
        viewport[flipType] = !viewport[flipType];
        cornerstone.setViewport(element, viewport);
    }

    function rotateHandler(angle) {
        const viewport = cornerstone.getViewport(element);
        viewport.rotation += angle;
        cornerstone.setViewport(element, viewport);
    }
}



