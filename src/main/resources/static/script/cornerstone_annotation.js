/** cornerstoneTool **/
cornerstoneTools.init();
let annotationBox = document.getElementById('annotationBox');

function showAnnotationBox() {
    annotationBox.style.display = 'inline-block';
}

window.addEventListener('click', function (e) {
    if(e.target.className !== 'annotation')
        annotationBox.style.display = 'none';
})

let isAngleToolActive = false;
let isActivateArrowAnnotate = false;
let isActivateProbe = false;
let isActivateLength = false;
let isActivateRectangleROI = false;
let isActivateEllipticalROI = false;
let isActivateFreeHand = false;
let isActivateBidirectional = false;
let isActivateCobbAngle = false;
let isActivateTextMarker = false;
let isActivateEraser = false;

function activateAngle() {
    const AngleTool = cornerstoneTools.AngleTool;
    if (isAngleToolActive){
        cornerstoneTools.setToolDisabled('Angle');
    }else {
        cornerstoneTools.addTool(AngleTool);
        cornerstoneTools.setToolActive('Angle', { mouseButtonMask: 1 });
    }
    isAngleToolActive = !isAngleToolActive;
}

function activateArrowAnnotate() {
    const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
    if (isActivateArrowAnnotate){
        cornerstoneTools.setToolDisabled('ArrowAnnotate');
    }else {
        cornerstoneTools.addTool(ArrowAnnotateTool)
        cornerstoneTools.setToolActive('ArrowAnnotate', { mouseButtonMask: 1 })
    }
    isActivateArrowAnnotate = !isActivateArrowAnnotate;
}

function activateProbe() {
    const ProbeTool = cornerstoneTools.ProbeTool;
    if (isActivateProbe){
        cornerstoneTools.setToolDisabled('Probe');
    }else {
        cornerstoneTools.addTool(ProbeTool)
        cornerstoneTools.setToolActive('Probe', { mouseButtonMask: 1 })
    }
    isActivateProbe = !isActivateProbe;
}

function activateLength() {
    const LengthTool = cornerstoneTools.LengthTool;
    if (isActivateLength){
        cornerstoneTools.setToolDisabled('Length');
    }else {
        cornerstoneTools.addTool(LengthTool)
        cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 })
    }
    isActivateLength = !isActivateLength;
}

function activateRectangleROI() {
    const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;
    if (isActivateRectangleROI){
        cornerstoneTools.setToolDisabled('RectangleRoi');
    }else {
        cornerstoneTools.addTool(RectangleRoiTool)
        cornerstoneTools.setToolActive('RectangleRoi', { mouseButtonMask: 1 })
    }
    isActivateRectangleROI = !isActivateRectangleROI;
}

function activateEllipticalROI() {
    const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
    if (isActivateEllipticalROI){
        cornerstoneTools.setToolDisabled('EllipticalRoi');
    }else {
        cornerstoneTools.addTool(EllipticalRoiTool)
        cornerstoneTools.setToolActive('EllipticalRoi', { mouseButtonMask: 1 })
    }
    isActivateEllipticalROI = !isActivateEllipticalROI;
}

function activateFreeHand() {
    const FreehandRoiTool = cornerstoneTools.FreehandRoiTool;
    if (isActivateFreeHand){
        cornerstoneTools.setToolDisabled('FreehandRoi');
    }else {
        cornerstoneTools.addTool(FreehandRoiTool)
        cornerstoneTools.setToolActive('FreehandRoi', { mouseButtonMask: 1 })
    }
    isActivateFreeHand = !isActivateFreeHand;
}

function activateBidirectional() {
    const BidirectionalTool = cornerstoneTools.BidirectionalTool;
    if (isActivateBidirectional){
        cornerstoneTools.setToolDisabled('Bidirectional');
    }else {
        cornerstoneTools.addTool(BidirectionalTool)
        cornerstoneTools.setToolActive('Bidirectional', {mouseButtonMask: 1})
    }
    isActivateBidirectional = !isActivateBidirectional;
}

function activateCobbAngle() {
    const CobbAngleTool = cornerstoneTools.CobbAngleTool
    if (isActivateCobbAngle){
        cornerstoneTools.setToolDisabled('CobbAngle');
    }else {
    cornerstoneTools.addTool(CobbAngleTool)
    cornerstoneTools.setToolActive('CobbAngle', { mouseButtonMask: 1 })
    }
    isActivateCobbAngle = !isActivateCobbAngle;
}

function activateTextMarker() {
    const TextMarkerTool = cornerstoneTools.TextMarkerTool
    const configuration = {
        markers: ['F5', 'F4', 'F3', 'F2', 'F1'],
        current: 'F5',
        ascending: true,
        loop: true,
    }
    if (isActivateTextMarker){
        cornerstoneTools.setToolDisabled('TextMarker');
    }else {
        cornerstoneTools.addTool(TextMarkerTool, { configuration })
        cornerstoneTools.setToolActive('TextMarker', { mouseButtonMask: 1 })
    }
    isActivateTextMarker = !isActivateTextMarker;
}

function activateEraser() {
    const EraserTool = cornerstoneTools.EraserTool
    if (isActivateEraser){
        cornerstoneTools.setToolDisabled('Eraser');
    }else {
        cornerstoneTools.addTool(EraserTool)
        cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 1 })
    }
    isActivateEraser = !isActivateEraser;
}
