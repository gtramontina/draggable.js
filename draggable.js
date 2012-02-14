!(function(moduleName, definition) {
    // Whether to expose Draggable as an AMD module or to the global object.
    if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
    else this[moduleName] = definition();

})('draggable', function definition() {
    var currentElement;
    var fairlyHighZIndex = '10';
    
    function draggable(element, handle) {
        handle = handle || element;
        setPositionType(element);
        setDraggableListeners(element);
        handle.addEventListener('mousedown', function(event) {
            startDragging(event, element);
        });
    }

    function setPositionType(element) {
        element.style.position = 'absolute';
    }

    function setDraggableListeners(element) {
        element.draggableListeners = {
            start: [],
            drag: [],
            stop: []
        };
        element.whenDragStarts = addListener(element, 'start');
        element.whenDragging = addListener(element, 'drag');
        element.whenDragStops = addListener(element, 'stop');
    }

    function startDragging(event, element) {
        currentElement && sendToBack(currentElement);
        currentElement = bringToFront(element);
        addDocumentListeners();

        var initialPosition = getInitialPosition(currentElement);
        currentElement.style.left = inPixels(initialPosition.left);
        currentElement.style.top = inPixels(initialPosition.top);

        currentElement.lastXPosition = event.clientX;
        currentElement.lastYPosition = event.clientY;

        triggerEvent('start', { x: currentElement.lastXPosition, y: currentElement.lastYPosition });
    }

    function addListener(element, type) {
        return function(listener) {
            element.draggableListeners[type].push(listener);
        };
    }

    function triggerEvent(type, args) {
        var listeners = currentElement.draggableListeners[type];
        for (var i = listeners.length - 1; i >= 0; i--) {
            listeners[i](args);
        };
    }

    function sendToBack(element) {
        var decreasedZIndex = fairlyHighZIndex - 1;
        element.style['z-index'] = decreasedZIndex;
        element.style['zIndex'] = decreasedZIndex;
    }

    function bringToFront(element) {
        element.style['z-index'] = fairlyHighZIndex;
        element.style['zIndex'] = fairlyHighZIndex;
        return element;
    }

    function addDocumentListeners() {
        document.addEventListener('selectstart', cancelDocumentSelection);
        document.addEventListener('mousemove', repositionElement);
        document.addEventListener('mouseup', removeDocumentListeners);
    }

    function getInitialPosition(element) {
        var top = 0;
        var left = 0;
        var currentElement = element;
        do {
            top += element.offsetTop;
            left += element.offsetLeft;
        } while (currentElement = currentElement.offsetParent);

        var computedStyle = getComputedStyle? getComputedStyle(element) : false;
        if (computedStyle) {
            left = left - parseInt(computedStyle['margin-left']) - parseInt(computedStyle['border-left']);
            top = top - parseInt(computedStyle['margin-top']) - parseInt(computedStyle['border-top']);
        }

        return {
            top: top,
            left: left
        };
    }

    function inPixels(value) {
        return value + 'px';
    }

    function cancelDocumentSelection(event) {
        event.preventDefault && event.preventDefault();
        event.stopPropagation && event.stopPropagation();
        event.returnValue = false;
        return false;
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

        triggerEvent('drag', { x: elementNewXPosition, y: elementNewYPosition });
    }

    function removeDocumentListeners(event) {
        document.removeEventListener('selectstart', cancelDocumentSelection);
        document.removeEventListener('mousemove', repositionElement);
        document.removeEventListener('mouseup', removeDocumentListeners);

        triggerEvent('stop', { x: currentElement.lastXPosition, y: currentElement.lastYPosition });
    }

    return draggable;
});