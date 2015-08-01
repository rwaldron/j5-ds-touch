// require("es6-shim");

var Emitter = require("events").EventEmitter;
var util = require("util");

module.exports = function(five) {
  return (function() {

    function Component(opts) {
      if (!(this instanceof Component)) {
        return new Component(opts);
      }

      five.Board.Component.call(
        this, opts = five.Board.Options(opts)
      );

      var state = {
        x: 0,
        y: 0,
      };

      this.io.i2cConfig(opts);

      this.io.i2cRead(0x04, 4, function(data) {
        var x = five.Fn.int16(data[0], data[1]);
        var y = five.Fn.int16(data[2], data[3]);

        if (x !== state.x || y !== state.y) {
          this.emit("change", { x: x, y: y });
        }

        state.x = x;
        state.y = y;

        this.emit("data", Object.assign({}, state));

      }.bind(this));

      Object.defineProperties(this, {
        x: {
          get: function() {
            return state.x;
          }
        },
        y: {
          get: function() {
            return state.y;
          }
        }
      });
    }

    util.inherits(Component, Emitter);

    // TODO:
    // Allow rotating or flipping?

    return Component;
  }());
};


/**
 *  To use the plugin in a program:
 *
 *  var five = require("johnny-five");
 *  var Component = require("component")(five);
 *
 *
 */
