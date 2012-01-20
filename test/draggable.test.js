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