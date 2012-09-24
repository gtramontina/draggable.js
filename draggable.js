function Draggable(element, handle, opts) {

	'use strict';

	// options
	this.options = {
		setCursor: true,	// change cursor to reflect draggable?
		setPosition: true,	// change draggable position to absolute?
		direction: {		// which directions to enable drag in
			x: true,		// true|false
			y: true			// true|false
		},
		limit: {			// limit the drag bounds
			x: null,		// [minimum position, maximum position]
			y: null			// [minimum position, maximum position]
		},
		onDrag: null,		// function(element, X position, Y position, event)
		onDragStart: null,	// function(element, X position, Y position, event)
		onDragEnd: null		// function(element, X position, Y position, event)
	};

	var options = this.options;

	// set user-defined options
	
	for (var opt in opts) {
		if (options.hasOwnProperty(opt)) {
			options[opt] = opts[opt];
		}
	}

	// internal vars
	var cursorOffsetX, cursorOffsetY, elementHeight, elementWidth;
	var self = this;
	var isIE = navigator.appName === 'Microsoft Internet Explorer';
	var hasTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

	// public vars
	this.element = handle || element;
	this.X = 0;
	this.Y = 0;

	this.move = function(x ,y) {
		var style = this.element.style;
		var direction = options.direction;
		var limit = options.limit;
		var lowIsOk, highIsOk;

		if (direction.x) {
			if (limit.x !== null) {
				lowIsOk  = x > limit.x[0];
				highIsOk = x + elementWidth <= limit.x[1];
			}
			else lowIsOk = highIsOk = 1;

			self.X = x;
			style.left =
				lowIsOk && highIsOk ? x + 'px' : (!lowIsOk ? 0 : (limit.x[1]-elementWidth) + 'px');
		}

		if (direction.y) {
			if (limit.y !== null) {
				lowIsOk  = y > limit.y[0],
				highIsOk = y + elementHeight <= limit.y[1];
			}
			else lowIsOk = highIsOk = 1;

			self.Y = y;
			style.top = lowIsOk && highIsOk ? y + 'px' : (!lowIsOk ? 0 : (limit.y[1]-elementHeight) + 'px');
		}
	};
	
	var init = function() {
		// set the element
		var element = self.element;
		if (!element) throw new Error('Invalid element passed to draggable: ' + element);

		// get element dimensions
		var compStyle = getStyle(element);
		elementHeight = nopx(compStyle.height);
		elementWidth = nopx(compStyle.width);

		// optional styling
		var style = element.style;
		if (options.setPosition) {
			style.left = element.offsetLeft + 'px';
			style.top = element.offsetTop + 'px';
			style.right = 'auto';
			style.bottom = 'auto';
			style.position = 'absolute';
		}
		if (options.setCursor) style.cursor = 'move';

		// attach mousedown event
		addEvent(element, (hasTouch ? 'touchstart' : 'mousedown'), start);
	};

	var start = function(e) {
		// cross-browser event
		var ev = e || window.event;

		// prevent browsers from visually dragging the element's outline
		stopEvent(ev);

		// set a high z-index, just in case
		var element = self.element;
		element.oldZindex = element.style.zIndex;
		element.style.zIndex = 10000;

		// set initial position
		var initialPosition = getInitialPosition(element);
		cursorOffsetX = (self.X=initialPosition.x) - (hasTouch ? ev.targetTouches[0] : ev).clientX;
		cursorOffsetY = (self.Y=initialPosition.y) - (hasTouch ? ev.targetTouches[0] : ev).clientY;

		// add event listeners
		var doc = document;
		addEvent(doc, 'selectstart', stopEvent);
		if (hasTouch) {
			addEvent(doc, 'touchmove', drag);
			addEvent(doc, 'touchend', stop);
		}
		else {
			addEvent(doc, 'mousemove', drag);
			addEvent(doc, 'mouseup', stop);
		}

		// trigger start event
		if (options.onDragStart) options.onDragStart(element, self.X, self.Y, ev);
	};

	var drag = function(e) {
		// cross-browser event
		var ev = e || window.event;

		// compute new coordinates
		var x = (hasTouch ? ev.targetTouches[0] : ev).clientX + cursorOffsetX;
		var y = (hasTouch ? ev.targetTouches[0] : ev).clientY + cursorOffsetY;

		// move the element
		self.move(x, y);

		// trigger drag event
		if (options.onDrag) options.onDrag(self.element, x, y, ev);
	};

	var stop = function(e) {
		// cross-browser event
		var ev = e || window.event;

		// remove event listeners
		var doc = document;
		removeEvent(doc, 'selectstart', stopEvent);
		if (hasTouch) {
			removeEvent(doc, 'touchmove', drag);
			removeEvent(doc, 'touchend', stop);
		}
		else {
			removeEvent(doc, 'mousemove', drag);
			removeEvent(doc, 'mouseup', stop);
		}

		// resent element's z-index
		self.element.style.zIndex = self.element.oldZindex;

		// trigger dragend event
		if (options.onDragEnd) options.onDragEnd(self.element, self.X, self.Y, ev);
	};

	var getInitialPosition = function(element) {

		var top = 0;
		var left = 0;
		var i = element;

		// compute element offset relative to the window
		do {
			top += i.offsetTop;
			left +=  i.offsetLeft;
		} while (i = i.offsetParent && !getStyle(i.parentNode).position);

		// subtract margin and border widths
		var style = getStyle(element);
		if (style) {
			left -= (nopx(style.marginLeft) || 0) - (nopx(style.borderLeftWidth) || 0);
			top -= (nopx(style.marginTop) || 0) - (nopx(style.borderTopWidth) || 0);
		}

		return {x: left, y: top};
	};

	function addEvent(element, e, func) {
		return isIE ? element.attachEvent('on'+e, func) : element.addEventListener(e, func, false);
	}

	function removeEvent(element, e, func) {
		return isIE ? element.detachEvent('on'+e, func) : element.removeEventListener(e, func, false);
	}

	function getStyle(element) {
		return isIE ? element.currentStyle : getComputedStyle(element);
	}

	var nopx = function(string) {
		return parseInt(string, 10);
	};

	var stopEvent = function(e) {
		isIE ? e.returnValue = false : e.preventDefault();
	};

	init();
}