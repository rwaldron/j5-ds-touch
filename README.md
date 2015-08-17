# DSTouch

A DS Touch Screen component plugin for [Johnny-Five](https://github.com/rwaldron/johnny-five).


## Basic Usage

### Arduino UNO (And Friends)

```js
var five = require("johnny-five");
var DSTouch = require("j5-ds-touch")(five);
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
```

### Tessel 2

```js
var five = require("johnny-five");
var DSTouch = require("j5-ds-touch")(five);
var Tessel = require("tessel-io");
var board = new five.Board({
  io: new Tessel()
});

board.on("ready", function() {
  var touch = new DSTouch();

  touch.on("change", function() {
    // 1023 is used to indicate no touch 
    if (this.x !== 1023 && this.y !== 1023) {
      console.log({ x: this.x, y: this.y });
    }
  });
});
```

### Intel Edison

```js
var five = require("johnny-five");
var DSTouch = require("j5-ds-touch")(five);
var Edison = require("edison-io");
var board = new five.Board({
  io: new Edison()
});

board.on("ready", function() {
  var touch = new DSTouch();

  touch.on("change", function() {
    // 1023 is used to indicate no touch 
    if (this.x !== 1023 && this.y !== 1023) {
      console.log({ x: this.x, y: this.y });
    }
  });
});
```

## Backpack Controller

### Install Firmware

Using the Arduino IDE, install the [firmware](https://github.com/rwaldron/j5-ds-touch/blob/master/firmware/ds_touch_slave.ino) to your AVR based microcontroller of choice. 

### Assembly

![DS Touch μC Backpack](https://github.com/rwaldron/j5-ds-touch/blob/master/assets/ds-touch-backpack.png)


### Connect To I2C Capable Platform

##### Arduino UNO

![DS Touch Backpack + Arduino UNO](https://raw.githubusercontent.com/rwaldron/j5-ds-touch/blob/master/assets/ds-touch-backpack-with-uno.png)

##### Tessel 2

![DS Touch Backpack + Tessel 2](https://raw.githubusercontent.com/rwaldron/j5-ds-touch/blob/master/assets/ds-touch-backpack-with-tessel-2.png)

##### Intel Edison MiniBoard

![DS Touch Backpack + Intel Edison MiniBoard](https://raw.githubusercontent.com/rwaldron/j5-ds-touch/blob/master/assets/ds-touch-backpack-with-edison-mini.png)

##### Intel Edison Arduino Board

![DS Touch Backpack + Arduino Board](https://raw.githubusercontent.com/rwaldron/j5-ds-touch/master/assets/ds-touch-backpack-with-edison-arduino.png)


## NOTE

The examples shown here are provided for illustration and do no specifically indicate platform support. This component class is expected to work with any platform that has I2C support. 
