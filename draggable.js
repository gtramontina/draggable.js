!(function(moduleName, definition) {
  // Whether to expose Draggable as an AMD module or to the global object.
  if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
  else if (typeof module === 'object') module.exports = definition();
  else this[moduleName] = definition();

})('draggable', function definition() {
  function addEventListener(element, eventName, handler) {
                if (element.addEventListener) {
                    element.addEventListener(eventName, handler, false);
                } else if (element.attachEvent) {
                    element.attachEvent('on' + eventName, handler);
                } else {
                    element['on' + eventName] = handler;
                }
            }
  function removeEventListener(element, eventName, handler) {
      if (element.removeEventListener) {
          element.removeEventListener(eventName, handler, false);
      } else if (element.detachEvent) {
          element.detachEvent('on' + eventName,handler);
      } else {
          element['on' + eventName] = null;
      }
  }
  function toCamelCase(s){
    return s.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
  }
  function getStyle(el, styleProp) {
      var s='';
        if (typeof el['currentStyle']==='object')
            s = el.currentStyle[toCamelCase(styleProp)];
        else if (window.getComputedStyle)
            s = document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        return s;
  }
  var currentElement;
  var fairlyHighZIndex = '10';

  function draggable(element, handle) {
    handle = handle || element;
    var index=parseInt(getStyle(element,'z-index'));
    fairlyHighZIndex = isNaN(index)? '10' : index ;
    setPositionType(element);
    setDraggableListeners(element);
    addEventListener(handle,'mousedown', function(event) {
        if (event.which == null)
        /* IE case */
            button = (event.button < 2) ? "LEFT" :
                ((event.button == 4) ? "MIDDLE" : "RIGHT");
        else
        /* All others */
            button = (event.which < 2) ? "LEFT" :
                ((event.which == 2) ? "MIDDLE" : "RIGHT");
      button==='LEFT' && startDragging(event, element);
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


    var initialPosition = getInitialPosition(currentElement);
    currentElement.style.left = inPixels(initialPosition.left);
    currentElement.style.top = inPixels(initialPosition.top);
    currentElement.lastXPosition = event.clientX;
    currentElement.lastYPosition = event.clientY;

    var okToGoOn = triggerEvent('start', { x: initialPosition.left, y: initialPosition.top, mouseEvent: event });
    if (!okToGoOn) return;

    addDocumentListeners();
  }

  function addListener(element, type) {
    return function(listener) {
      element.draggableListeners[type].push(listener);
    };
  }

  function triggerEvent(type, args) {
    var result = true;
    var listeners = currentElement.draggableListeners[type];
    for (var i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i](args) === false) result = false;
    };
    return result;
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
    addEventListener(document,'selectstart', cancelDocumentSelection);
    addEventListener(document,'mousemove', repositionElement);
    addEventListener(document,'mouseup', removeDocumentListeners);
  }

  function getInitialPosition(element) {
  var rect={};
    if(getStyle(element,'position')=='absolute'){
        rect={top:parseInt(getStyle(element,'top')),left:parseInt(getStyle(element,'left'))};
    }else{
       rect = element.getBoundingClientRect();

    }
   return {
      top: rect.top,
      left: rect.left
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
    event.preventDefault && event.preventDefault();
    event.returnValue = false;
    var style = currentElement.style;
    var elementXPosition = parseInt(style.left, 10);
    var elementYPosition = parseInt(style.top, 10);

    var elementNewXPosition = elementXPosition + (event.clientX - currentElement.lastXPosition);
    var elementNewYPosition = elementYPosition + (event.clientY - currentElement.lastYPosition);

    style.left = inPixels(elementNewXPosition);
    style.top = inPixels(elementNewYPosition);

    currentElement.lastXPosition = event.clientX;
    currentElement.lastYPosition = event.clientY;

    triggerEvent('drag', { x: elementNewXPosition, y: elementNewYPosition, mouseEvent: event });
  }

  function removeDocumentListeners(event) {
    removeEventListener(document,'selectstart',cancelDocumentSelection);
    removeEventListener(document,'mousemove',repositionElement);
    removeEventListener(document,'mouseup',removeDocumentListeners);

    var left = parseInt(currentElement.style.left, 10);
    var top = parseInt(currentElement.style.top, 10);
    triggerEvent('stop', { x: left, y: top, mouseEvent: event });
  }

  return draggable;
});
