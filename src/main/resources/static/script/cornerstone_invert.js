/** Invert **/
var invertButton = document.getElementById('invert');
var invertCheck;

function invertImageWithWWWC(divById) {
    const selectedDiv = cornerstone.getEnabledElement(divById).element;
    var viewport = cornerstone.getViewport(selectedDiv);
    viewport.invert = invertCheck;
    cornerstone.setViewport(selectedDiv, viewport);
}

invertButton.addEventListener('click', function () {
    if (selectedDivById.getAttribute('invert') === 'unchecked') {
        selectedDivById.setAttribute('invert', 'checked');
        invertCheck = true;
    } else {
        selectedDivById.setAttribute('invert', 'unchecked');
        invertCheck = false;
    }
    invertImageWithWWWC(selectedDivById);
});

function invertHandler(divById) {
    selectedDivById = divById;
    var invertVal = divById.getAttribute('invert');
    if (invertVal === null)
        divById.setAttribute('invert', 'unchecked'); // checked
}