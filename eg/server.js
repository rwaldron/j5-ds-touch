// Server deps
var http = require("http");
var socket = require("socket.io");
var fs = require("fs");
var exec = require("child_process").exec;

// Hardware deps
var five = require("johnny-five");
var DSTouch = require("../")(five);


var app = http.createServer(function(req, res) {
  var path = __dirname;

  if (req.url === "/") {
    path += "/index.html";
  } else {
    path += req.url;
  }

  fs.readFile(path, function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading " + path);
    }

    res.writeHead(200);
    res.end(data);
  });
});
app.listen(8080);

var io = socket.listen(app);
var board = new five.Board();

board.on("ready", function() {
  var isDrawing = false;

  io.sockets.on("connection", function(socket) {
    console.log("connected");
    var touch = new DSTouch();

    touch.on("data", function() {
      var data = { x: this.x, y: this.y };

      if (isDrawing) {
        if (!isTouching(data)) {
          isDrawing = false;
          socket.emit("up", data);
        } else {
          socket.emit("move", data);
        }
      } else {
        if (!isDrawing) {

          if (isTouching(data)) {
            isDrawing = true;
            socket.emit("down", data);
            socket.emit("move", data);

          }
        }
      }
    });
  });

  exec("open http://localhost:8080/ploma-app/index.html");
});

function isTouching(point) {
  return point.x !== 1023 && point.y !== 1023
}
