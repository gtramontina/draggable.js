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

#### Notes
* You have to provide the raw element, not the one wrapped by your favorite dom query lib. Using jQuery, for example, you'd need to do something like `var elementToDrag = $('#elementToDrag').get(0);`
* If you are using AMD (e.g. require.js) this lib becomes a module. Otherwise it'll create a global `draggable`.

### Browser Compatibility
I've ran the tests in Chrome and Firefox.
If you find any incompatibility or want to support other browsers, please do a pull request with the fix! :-)

### License
This is licensed under the feel-free-to-do-whatever-you-want-to-do license.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/gtramontina/draggable.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

