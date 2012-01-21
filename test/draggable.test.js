describe('Draggable.js', function() {
    var draggableBox;
    var initialPosition = {
        top: 100,
        left: 100
    };

    beforeEach(function() {
        draggableBox = $('<div style="width:100px;height:100px;position:fixed;">');
        draggableBox.css(initialPosition);
        $('body').append(draggableBox);
        draggableBox = draggableBox.get(0);
    });

    afterEach(function() {
        $(draggableBox).remove();
    });

    describe('when dragging an element to a new position', function() {
        it('should update the element\'s position', function() {
            draggable(draggableBox);
            dragElementBy(draggableBox, 100, 100);

            var newTopPosition = initialPosition.top + 100;
            var newLeftPosition = initialPosition.left + 100;

            var actualPosition = $(draggableBox).position();
            expect(actualPosition.top).to.be(newTopPosition);
            expect(actualPosition.left).to.be(newLeftPosition);
        });

        
        var fairlyHighZIndex = '10';
        it('should bring the element to front', function() {
            draggable(draggableBox);
            dragElementBy(draggableBox, -10, -10);
            
            expect($(draggableBox).css('z-index')).to.be(fairlyHighZIndex);
        });

        it('should send the previous element to back', function() {
            var previousElement = $('<div style="width:100px;height:100px;position:fixed;">');
            $('body').append(previousElement);
            previousElement = previousElement.get(0);
            draggable(previousElement);
            draggable(draggableBox);
            dragElementBy(previousElement, 300, 200);

            dragElementBy(draggableBox, 10, 10);
            var decreasedZIndex = fairlyHighZIndex - 1 + '';
            expect($(previousElement).css('z-index')).to.be(decreasedZIndex);
        });
    });

    describe('when dragging an element with a handle to a new position', function() {
        var handle;
        beforeEach(function() {
            handle = $('<div style="height:20px;">');
            $(draggableBox).append(handle);

            handle = handle.get(0);
            draggable(draggableBox, handle);
        });

        describe('via handle', function() {
            it('should update the element\'s position', function() {
                dragElementBy(handle, 50, 100);


                var newTopPosition = initialPosition.top + 100;
                var newLeftPosition = initialPosition.left + 50;

                var actualPosition = $(draggableBox).position();
                expect(actualPosition.top).to.be(newTopPosition);
                expect(actualPosition.left).to.be(newLeftPosition);
            });

        });

        describe('via the element itselft', function() {
            it('should not do anything', function() {
                dragElementBy(draggableBox, 200, 100);

                var actualPosition = $(draggableBox).position();
                expect(actualPosition.top).to.be(initialPosition.top);
                expect(actualPosition.left).to.be(initialPosition.left);
            });
        });
    });

    function dragElementBy(element, differenceInX, differenceInY) {
        happen.mousedown(element);
        happen.mousemove(element, {
            clientX: differenceInX,
            clientY: differenceInY
        });
        happen.mouseup(element);
    };
});