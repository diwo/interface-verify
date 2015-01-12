'use strict';

(function() {
  var Interface = require('../lib/interface');

  describe('Interface definitions', function() {
    it('Ensure interface can be defined with methods in constructor', function() {
      var Server = new Interface('Server', [
        {
          methodName: 'listen',
          argTypes: ['number', 'function'],
          retType: 'void'
        }
      ]);

      expect(Server.methods.length).toBe(1);
    });

    it('Ensure interface can be defined without methods in constructor', function() {
      var Client = new Interface('Client');

      expect(Client.methods.length).toBe(0);
    });
  });

  describe('Validation on classes implementing interfaces', function() {
    var Shape, Drawable;

    /* jshint unused:false */
    var SquareClassBuilder = {
      builder: function() {
        this.squareClass = function(width) {};
        return this;
      },
      withArea: function() {
        this.squareClass.prototype.area = function() { return 0; };
        return this;
      },
      withEdges: function() {
        this.squareClass.prototype.edges = function() { return 0; };
        return this;
      },
      withDraw: function() {
        this.squareClass.prototype.draw = function(x, y) {};
        return this;
      },
      build: function() {
        return this.squareClass;
      }
    };

    beforeEach(function(done) {
      Shape = new Interface('Shape');
      Shape.defineMethod('area', [], 'number');
      Shape.defineMethod('edges', [], 'number');

      Drawable = new Interface('Drawable');
      Drawable.defineMethod('draw', ['number', 'number'], 'void');

      done();
    });

    it('Ensure validation succeeds when class implements all methods of its interfaces', function() {
      var Square =
          SquareClassBuilder.builder()
              .withArea()
              .withEdges()
              .withDraw()
              .build();

      expect(function() {
        Interface.verifyImplementation(Square, [Shape, Drawable]);
      }).not.toThrow();
    });

    it('Ensure validation fails when class doesn\'t implement all methods of an interface', function() {
      var Square =
          SquareClassBuilder.builder()
              .withArea()
              .build();

      expect(function() {
        Interface.verifyImplementation(Square, [Shape]);
      }).toThrow();
    });

    it('Ensure validation fails when class doesn\'t implement all interfaces', function() {
      var Square =
          SquareClassBuilder.builder()
              .withArea()
              .withEdges()
              .build();

      expect(function() {
        Interface.verifyImplementation(Square, [Shape, Drawable]);
      }).toThrow();
    });
  });

})();

