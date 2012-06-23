!(function(moduleName, definition) {
	// Whether to expose Draggable as an AMD module or to the global object.
	if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
	else this[moduleName] = definition();

})('draggable', function definition() {

	// options

	var setCursor = true;
	var setPosition = true;

	// vars

	var X, Y, initialX, initialY;
	var highZIndex = 10000;
	var isIE = navigator.appName === 'Microsoft Internet Explorer';
	
	function draggable(element, handle) {

		if (!element) throw new Error('Invalid element passed to draggable: ' + element);

		handle = handle || element;
		setListeners(element);
		addEvent(handle, 'mousedown', function(event){start(event, element)});

		if (setPosition) {
			var style = element.style;
			style.left = element.offsetLeft + 'px';
			style.top = element.offsetTop + 'px';
			style.position = 'absolute';
		}
		if (setCursor) element.style.cursor = 'move';
	}

	function start(e, element) {
		// cross-browser event
		var e = e || event;

		// prevent browsers from visually dragging the element's outline
		isIE ? e.returnValue = false : e.preventDefault();

		// set a high z-index, just in case
		element.oldZindex = element.style.zIndex || '';
		element.style.zIndex = highZIndex;

		// set initial position
		var initialPosition = getInitialPosition(element);
		X = initialX = initialPosition.x - e.clientX;
		Y = initialY = initialPosition.y - e.clientY;

		// add event listeners
		var doc = document;
		addEvent(doc, 'selectstart', cancelDocumentSelection);
		addEvent(doc, 'mousemove', drag);
		addEvent(doc, 'mouseup', stop);

		// trigger start event
		triggerEvent('dragstart', {
			x: initialPosition.x,
			y: initialPosition.y,
			mouseEvent: e
		});
	}

	function drag(e) {
		// cross-browser event
		var e = e || event;

		// compute new coordinates
		X = initialX + e.clientX;
		Y = initialY + e.clientY;

		// move the element
		var style = element.style;
		style.left = X + 'px';
		style.top = Y + 'px';

		// trigger drag event
		triggerEvent('drag', {x: X, y: Y, mouseEvent: e});
	}

	function stop(e) {
		// cross-browser event
		var e = e || event;

		// remove event listeners
		var doc = document;
		removeEvent(doc, 'mousemove', drag);
		removeEvent(doc, 'mouseup', stop);
		removeEvent(doc, 'selectstart', cancelDocumentSelection);

		// resent element's z-index
		element.style.zIndex = element.oldZindex;

		// drigger dragend event
		triggerEvent('dragend', {
			x: X,
			y: Y,
			mouseEvent: e
		});
	}

	function getInitialPosition(element) {

		var top = 0;
		var left = 0;
		var i = element;

		// compute element offset relative to the window
		do {
			top += i.offsetTop;
			left +=  i.offsetLeft;
		} while (i = i.offsetParent);

		// subtract margin and border widths
		if (style = getStyle(element)) {
			left -= (nopx(style['marginLeft']) || 0) - (nopx(style['borderLeftWidth']) || 0);
			top -= (nopx(style['marginTop']) || 0) - (nopx(style['borderTopWidth']) || 0);
		}

		return {x: left, y: top};
	}

	function cancelDocumentSelection(e) {
		isIE ? event.returnValue = false : e.preventDefault();
	}

	function addListener(element, type) {
		return function(listener) {
			element.draggableListeners[type].push(listener);
		};
	}

	function setListeners(element) {
		element.draggableListeners = {
			dragstart: [],
			drag: [],
			dragend: []
		};
		element.whenDragStarts = addListener(element, 'dragstart');
		element.whenDragging = addListener(element, 'drag');
		element.whenDragStops = addListener(element, 'dragend');
	}

	function triggerEvent(type, args) {
		var result = true;
		for (listeners = element.draggableListeners[type], n = listeners.length; n--;) {
			if (listeners[n](args) === false) result = false;
		}
		return result;
	}

	function addEvent(element, e, func) {
		return isIE ? element.attachEvent('on'+e, func) : element.addEventListener(e, func, false);
	}

	function removeEvent(element, e, func) {
		return isIE ? element.detachEvent('on'+e, func) : element.removeEventListener(e, func, false)
	}

	function getStyle(element) {
		return isIE ? element.currentStyle : getComputedStyle(element);
	}

	function nopx(string) {
		return parseInt(string, 10);
	}

	return draggable;
});