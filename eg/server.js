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
  var screen = new DSTouch();
  var previous = { x: null, y: null };
  var socket = null;

  function transmit(type, data) {
    if (!socket) {
      return;
    }
    previous.x = data.x;
    previous.y = data.y;
    socket.emit(type, data);
  }

  screen.on("move", function() {
    transmit("touch:move", { x: this.x, y: this.y });
  });

  screen.on("down", function() {
    transmit("touch:down", { x: this.x, y: this.y });
  });

  screen.on("up", function() {
    transmit("touch:up", previous);
  });

  io.sockets.on("connection", function(connection) {
    socket = connection;
  });

  exec("open http://localhost:8080/ploma-app/index.html");
});
