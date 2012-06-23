# Draggable.js #
##### Make your dom elements draggable easily. #####

### Examples
DOM:

    <div id="elementToDrag">
        <div class="handle"></div>
    </div>

To make the whole element draggable:

    var elementToDrag = document.getElementById('elementToDrag');
    draggable(elementToDrag);

To make it draggable only when dragging the handle element:

    var elementToDrag = document.getElementById('elementToDrag');
    var handle = elementToDrag.getElementsByClassName('handle')[0];    
    draggable(elementToDrag, handle);

### Notes
* You have to provide the raw element, not the one wrapped by your favorite dom query lib. Using jQuery, for example, you'd need to do something like `var elementToDrag = $('#elementToDrag').get(0);`
* If you are using AMD (e.g. require.js) this lib becomes a module. Otherwise it'll create a global `draggable`.

### Browser Compatibility
* Chrome
* Firefox
* Internet Explorer 7+ (probably 6+, but untested)
* Safari
* Opera

### To Do
* Add iOS support
* Defer to CSS3 transitions for hardware accelerated animation in modern browsers
* Defer to HTML5 drag and drop API in modern browsers

### License
This is licensed under the feel-free-to-do-whatever-you-want-to-do license.

### Changelog

v2.0 (modified by Boris Cherny)
* Minimized repaints by eliminating style queries on every step of the drag
* Generally improved performance
* Improved browser compatibility
* Standardized event names (start -> dragstart, stop -> dragend)
* Lots of bugfixes (eliminated outline dragging, fixed border/margin/zindex querying)