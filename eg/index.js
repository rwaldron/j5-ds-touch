// Server deps
var http = require("http");
var socket = require("socket.io");
var fs = require("fs");

// Hardware deps
var five = require("johnny-five");
var DSTouch = require("../")(five);

var board = new five.Board();
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

board.on("ready", function() {
  io.sockets.on("connection", function(socket) {
    console.log("connected");
    var touch = new DSTouch();

    touch.on("change", function() {
      if (this.x < 1000 && this.y < 1000) {
        socket.emit("change", { x: this.x, y: this.y });
      }
    });
  });
});
