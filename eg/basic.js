var five = require("johnny-five");
var DSTouch = require("../")(five);

var board = new five.Board();

board.on("ready", function() {
  var touch = new DSTouch();

  touch.on("change", function() {
    if (this.x < 1000 && this.y < 1000) {
      console.log({ x: this.x, y: this.y });
      // socket.emit("change", { x: this.x, y: this.y });
    }
  });
});
