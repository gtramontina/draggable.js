(function(exports) {

    function draggable(element, handle) {
        handle = handle || element;
        handle.addEventListener('mousedown', function(event) {
            dragStart(event, element);
        });
    };

    var currentElement;

    function dragStart(event, element) {
        currentElement = element;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragStop);

        var style = currentElement.style;
        style.left = style.left ? style.left : '0px';
        style.top = style.top ? style.top : '0px';

        currentElement.lastXPosition = event.clientX;
        currentElement.lastYPosition = event.clientY;
    };

    function drag(event) {
        var style = currentElement.style;
        var elementXPosition = parseInt(style.left);
        var elementYPosition = parseInt(style.top);

        var deltaX = event.clientX - currentElement.lastXPosition;
        var deltaY = event.clientY - currentElement.lastYPosition;
        var elementNewXPosition = elementXPosition + deltaX;
        var elementNewYPosition = elementYPosition + deltaY;

        style.left = elementNewXPosition + 'px';
        style.top = elementNewYPosition + 'px';

        currentElement.lastXPosition = event.clientX;
        currentElement.lastYPosition = event.clientY;
    };

    function dragStop(event) {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragStop);
    };

    // Whether to expose Draggable as an AMD module
    // or to the global object.
    if (typeof define === 'function' && define.amd) {
        define('draggable', [], function() {
            return draggable;
        });
    } else {
        exports.draggable = draggable;
    }
})(window);