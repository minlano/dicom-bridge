/* cornerstoneTool */
cornerstoneTools.init();
let annotationBox = document.getElementById('annotationBox');

function showAnnotationBox() {
    annotationBox.style.display = 'inline-block';
}

window.addEventListener('click', function (e) {
    if(e.target.className !== 'annotation')
        annotationBox.style.display = 'none';
})
function activateAngle() {
    const AngleTool = cornerstoneTools.AngleTool;

    cornerstoneTools.addTool(AngleTool)
    cornerstoneTools.setToolActive('Angle', { mouseButtonMask: 1 })
}

function activateArrowAnnotate() {
    const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool

    cornerstoneTools.addTool(ArrowAnnotateTool)
    cornerstoneTools.setToolActive('ArrowAnnotate', { mouseButtonMask: 1 })
}

function activateProbe() {
    const ProbeTool = cornerstoneTools.ProbeTool

    cornerstoneTools.addTool(ProbeTool)
    cornerstoneTools.setToolActive('Probe', { mouseButtonMask: 1 })
}

function activateLength() {
    const LengthTool = cornerstoneTools.LengthTool

    cornerstoneTools.addTool(LengthTool)
    cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 })
}

function activateRectangleROI() {
    const RectangleRoiTool = cornerstoneTools.RectangleRoiTool

    cornerstoneTools.addTool(RectangleRoiTool)
    cornerstoneTools.setToolActive('RectangleRoi', { mouseButtonMask: 1 })
}

function activateEllipticalROI() {
    const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool

    cornerstoneTools.addTool(EllipticalRoiTool)
    cornerstoneTools.setToolActive('EllipticalRoi', { mouseButtonMask: 1 })
}

function activateFreeHand() {
    const FreehandRoiTool = cornerstoneTools.FreehandRoiTool

    cornerstoneTools.addTool(FreehandRoiTool)
    cornerstoneTools.setToolActive('Freehand', { mouseButtonMask: 1 })
}

function activateBidirectional() {
    const BidirectionalTool = cornerstoneTools.BidirectionalTool

    cornerstoneTools.addTool(BidirectionalTool)
    cornerstoneTools.setToolActive('Bidirectional', { mouseButtonMask: 1 })
}

function activateCobbAngle() {
    const CobbAngleTool = cornerstoneTools.CobbAngleTool

    cornerstoneTools.addTool(CobbAngleTool)
    cornerstoneTools.setToolActive('CobbAngle', { mouseButtonMask: 1 })
}

function activateTextMarker() {
    const TextMarkerTool = cornerstoneTools.TextMarkerTool

    const configuration = {
        markers: ['F5', 'F4', 'F3', 'F2', 'F1'],
        current: 'F5',
        ascending: true,
        loop: true,
    }
    cornerstoneTools.addTool(TextMarkerTool, { configuration })
    cornerstoneTools.setToolActive('TextMarker', { mouseButtonMask: 1 })
}

function activateEraser() {
    const EraserTool = cornerstoneTools.EraserTool

    cornerstoneTools.addTool(EraserTool)
    cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 1 })
}
