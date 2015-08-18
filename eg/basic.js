var five = require("johnny-five");
var DSTouch = require("../")(five);
var board = new five.Board();

board.on("ready", function() {
  var touch = new DSTouch();

  touch.on("change", function() {
    // 1023 is used to indicate no touch
    if (this.x !== 1023 && this.y !== 1023) {
      console.log({ x: this.x, y: this.y });
    }
  });
});
