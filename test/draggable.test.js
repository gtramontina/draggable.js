describe('Draggable.js', function() {
  var draggableBox;
  var initialPosition = {
    top: 100,
    left: 100
  };

  beforeEach(function() {
    draggableBox = $('<div style="width:100px;height:100px;">');
    draggableBox.css(initialPosition);
    $('body').append(draggableBox);
    draggableBox = draggableBox.get(0);
  });

  afterEach(function() {
    $(draggableBox).remove();
  });

  it('when making an element draggable, should set its position as absolute', function() {
    draggable(draggableBox);
    expect($(draggableBox).css('position')).to.be('absolute');
  });

  describe('when dragging an element to a new position', function() {
    it('should update the element\'s position', function() {
      draggable(draggableBox);
      dragElementTo(draggableBox, [310, 220]);

      var actualPosition = $(draggableBox).position();
      expect(actualPosition.top).to.be(220);
      expect(actualPosition.left).to.be(310);
    });


    var fairlyHighZIndex = '10';
    it('should bring the element to front', function() {
      draggable(draggableBox);
      dragElementTo(draggableBox);
      // in IE11 $(draggableBox).css('z-index') is a number
      expect(String($(draggableBox).css('z-index'))).to.be(fairlyHighZIndex);
    });

    it('should send the previous element to back', function() {
      var previousElement = $('<div style="width:100px;height:100px;position:fixed;">');
      $('body').append(previousElement);
      previousElement = previousElement.get(0);
      draggable(previousElement);
      draggable(draggableBox);
      dragElementTo(previousElement);

      dragElementTo(draggableBox, 0, 0);
      var decreasedZIndex = fairlyHighZIndex - 1 + '';
      // in IE11 $(previousElement).css('z-index') is a number
      expect(String($(previousElement).css('z-index'))).to.be(decreasedZIndex);
    });

    describe('should trigger events', function() {
      it('when drag starts', function(done) {
        draggable(draggableBox);
        draggableBox.whenDragStarts(function(event) {
          assertTopLeftPosition([event.x, event.y], [initialPosition.left, initialPosition.top], done);
          expect(event.mouseEvent).to.be.a(MouseEvent);
        });
        dragElementTo(draggableBox);
      });

      it('should prevent the drag start action when any of the listeners return false', function() {
        draggable(draggableBox);
        draggableBox.whenDragStarts(function() {
          return false;
        });
        var originalPosition = $(draggableBox).position();
        dragElementTo(draggableBox, [555, 666]);

        var lastPosition = $(draggableBox).position();
        expect(lastPosition.top).to.be(originalPosition.top);
        expect(lastPosition.left).to.be(originalPosition.left);
      });


      it('when dragging', function(done) {
        draggable(draggableBox);
        draggableBox.whenDragging(function(event) {
          assertTopLeftPosition([event.x, event.y], [222, 111], done);
          expect(event.mouseEvent).to.be.a(MouseEvent);
        });
        dragElementTo(draggableBox, [222, 111]);
      });

      it('when drag stops', function(done) {
        draggable(draggableBox);
        draggableBox.whenDragStops(function(event) {
          assertTopLeftPosition([event.x, event.y], [555, 666], done);
          expect(event.mouseEvent).to.be.a(MouseEvent);
        });
        dragElementTo(draggableBox, [111, 222], [333, 444], [555, 666]);
      });

      function assertTopLeftPosition(actual, expected, done) {
        var error;
        try {
          expect(actual[0]).to.be(expected[0]);
          expect(actual[1]).to.be(expected[1]);
        } catch (e) {
          error = e;
        }
        done(error);
      }
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
        dragElementTo(handle, [50, 100]);

        var newTopPosition = initialPosition.top + 100;
        var newLeftPosition = initialPosition.left + 50;

        var actualPosition = $(draggableBox).position();
        expect(actualPosition.top).to.be(newTopPosition);
        expect(actualPosition.left).to.be(newLeftPosition);
      });

    });

    describe('via the element itselft', function() {
      it('should not do anything', function() {
        dragElementTo(draggableBox, [200, 100]);

        var actualPosition = $(draggableBox).position();
        expect(actualPosition.top).to.be(initialPosition.top);
        expect(actualPosition.left).to.be(initialPosition.left);
      });
    });
  });

  function dragElementTo(/* element, points */) {
    var element = arguments[0];
    var points = (2 <= arguments.length) ? Array.prototype.slice.call(arguments, 1) : [];

    var downPosition = $(element).position();
    happen.mousedown(element, { clientX: downPosition.left, clientY: downPosition.top });
    var lastPoint = [downPosition.left, downPosition.top];
    for (var i = 0; i < points.length; i++) {
      happen.mousemove(element, { clientX: points[i][0], clientY: points[i][1] });
      lastPoint = points[i];
    };
    happen.mouseup(element, { clientX: lastPoint[0], clientY: lastPoint[1] });
  };
});