require("es6-shim");

var sinon = require("sinon");
var EventEmitter = require("events").EventEmitter;

var five = {
  Fn: {
    int16: function(high, low) {
      var result = (high << 8) | low;
      // if highest bit is on, it is negative
      return result >> 15 ? ((result ^ 0xFFFF) + 1) * -1 : result;
    },
  },
};

function IO() {}

IO.prototype.i2cConfig = function() {};
IO.prototype.i2cRead = function() {};

function Board() {
  this.io = new IO();
}

Board.Component = function(opts) {
  this.io = opts.board.io;
};

Board.Options = function(opts) {
  return Object.assign({}, opts || {});
};

five.Board = Board;


var sandbox = sinon.sandbox.create();
var DSTouch = require("../")(five);

exports["DSTouch"] = {
  setUp: function(done) {
    this.i2cConfig = sandbox.spy(IO.prototype, "i2cConfig");
    this.i2cRead = sandbox.spy(IO.prototype, "i2cRead");


    this.board = new Board({
      io: new IO()
    });

    this.opts = {
      board: this.board,
    };

    this.touch = new DSTouch(this.opts);
    done();
  },

  tearDown: function(done) {
    sandbox.restore();
    done();
  },

  emitter: function(test) {
    test.expect(1);
    test.ok(this.touch instanceof EventEmitter);
    test.done();
  },

  instanceProperties: function(test) {
    test.expect(2);
    test.notEqual(typeof this.touch.x, undefined);
    test.notEqual(typeof this.touch.y, undefined);
    test.done();
  },

  i2cConfigDefaultAddress: function(test) {
    test.expect(2);

    test.equal(this.i2cConfig.callCount, 1);
    test.deepEqual(this.i2cConfig.lastCall.args[0], this.opts);
    test.done();
  },

  i2cConfigExplicitAddress: function(test) {
    test.expect(2);

    this.i2cConfig.reset();

    var opts = {
      board: this.board,
      address: 0x01
    };

    this.touch = new DSTouch(opts);

    test.equal(this.i2cConfig.callCount, 1);
    test.deepEqual(this.i2cConfig.lastCall.args[0], opts);
    test.done();
  },

  i2cRead: function(test) {
    test.expect(3);

    this.i2cRead.reset();

    this.touch = new DSTouch({
      board: this.board,
      address: 0x01
    });

    test.equal(this.i2cRead.callCount, 1);
    test.equal(this.i2cRead.lastCall.args[0], 0x01);
    test.equal(this.i2cRead.lastCall.args[1], 4);
    test.done();
  },

  // TODO:
  // Tests for down, up, move, data, change
};
