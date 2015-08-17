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

      var address = opts.address || 0x04;

      var state = {
        pending: false,
        touching: false,
        x: 1023,
        y: 1023,
      };

      this.io.i2cConfig(opts);

      this.io.i2cRead(address, 4, function(data) {
        var present = "";
        var x = five.Fn.int16(data[0], data[1]);
        var y = five.Fn.int16(data[2], data[3]);

        if (x !== state.x || y !== state.y) {
          this.emit("change", { x: x, y: y });
        }

        if (x === 1023 && y === 1023 && state.touching) {
          state.touching = false;
          this.emit("up", { x: state.x, y: state.y });
        }

        if (x !== 1023 && y !== 1023) {
          if (!state.touching) {
            // The stylus is down, but we don't want
            // the very first reading. This will prevent points
            // appearing as though they are still off the surface.
            state.pending = true;
          } else {
            if (state.pending) {
              state.pending = false;
              this.emit("down", { x: x, y: y });
            }
            this.emit("move", { x: x, y: y });
          }

          state.touching = true;
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
