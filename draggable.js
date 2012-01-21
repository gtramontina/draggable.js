!(function(moduleName, definition) {
    // Whether to expose Draggable as an AMD module
    // or to the global object.
    if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
    else this[moduleName] = definition();

})('draggable', function definition() {
    var currentElement;
    var fairlyHighZIndex = '10';
    
    function draggable(element, handle) {
        handle = handle || element;
        handle.addEventListener('mousedown', function(event) {
            startDragging(event, element);
        });
    }

    function startDragging(event, element) {
        if (currentElement) sendToBack(currentElement);
        currentElement = bringToFront(element);
        addDocumentListeners();

        var initialPosition = getInitialPosition(currentElement);
        currentElement.style.left = inPixels(initialPosition.left);
        currentElement.style.top = inPixels(initialPosition.top);

        currentElement.lastXPosition = event.clientX;
        currentElement.lastYPosition = event.clientY;
    }

    function sendToBack(element) {
        var decreasedZIndex = fairlyHighZIndex - 1;
        element.style['z-index'] = decreasedZIndex;
        element.style['zIndex'] = decreasedZIndex;
    }

    function bringToFront(element) {
        element.style['zIndex'] = fairlyHighZIndex;
        element.style['z-index'] = fairlyHighZIndex;
        return element;
    }

    function addDocumentListeners() {
        document.addEventListener('mousemove', repositionElement);
        document.addEventListener('mouseup', removeDocumentListeners);
    }

    function getInitialPosition(element) {
        var top = 0;
        var left = 0;
        do {
            top += element.offsetTop;
            left += element.offsetLeft;
        } while (element = element.offsetParent);
        return {
            top: top,
            left: left
        };
    }

    function inPixels(value) {
        return value + 'px';
    }

    function repositionElement(event) {
        var style = currentElement.style;
        var elementXPosition = parseInt(style.left, 10);
        var elementYPosition = parseInt(style.top, 10);

        var elementNewXPosition = elementXPosition + (event.clientX - currentElement.lastXPosition);
        var elementNewYPosition = elementYPosition + (event.clientY - currentElement.lastYPosition);

        style.left = inPixels(elementNewXPosition);
        style.top = inPixels(elementNewYPosition);

        currentElement.lastXPosition = event.clientX;
        currentElement.lastYPosition = event.clientY;
    }

    function removeDocumentListeners() {
        document.removeEventListener('mousemove', repositionElement);
        document.removeEventListener('mouseup', removeDocumentListeners);
    }

    return draggable;
});