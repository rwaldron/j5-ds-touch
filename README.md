# DSTouch

A DS Touch Screen component plugin for [Johnny-Five](https://github.com/rwaldron/johnny-five).

- [SparkFun Nintendo DS Screen Kit](https://www.sparkfun.com/products/13631)
- [Adafruit Touch Screen (Nintendo DSL digitizer)](https://www.adafruit.com/products/333) + [Touch screen breakout board](https://www.adafruit.com/product/334)

## API & Documentation

### DSTouch 

The `DSTouch` class constructs objects that represent a single Nintendo DS Touch screen component.

#### Parameters

| Property   | Type      | Value(s)/Description      | Default | Required |
|------------|-----------|---------------------------|---------|-----------|
| address    | number    | Address for I2C device \*  | 0x04    | no |

\* The address used by this "backpack" component is `0x04`. This can be changed by modifying the value in the firmware. 

#### Properties

| Property   | Type      | Value(s)/Description      |
|------------|-----------|---------------------------|
| x    | number    | The `x` coordinate of the present touch point. Will read `1023` if there is no touch point.  |
| y    | number    | The `y` coordinate of the present touch point. Will read `1023` if there is no touch point.  |


#### Events

- **change** The "change" event is emitted whenever the `[x, y]` coordinates of the pointer has changed.

- **data** The "data" event is fired as frequently as the user defined `freq` will allow in milliseconds.

- **down** The pointer is touching the surface, but was previously not touching the surface.

- **move** The pointer is touching the surface and has changed coordinates since the last position was read. 

- **up** The pointer is not touching the surface, but was previously touching the surface.


NOTE: The word _pointer_ means either stylus or finger.



## Backpack Controller

### Install Firmware

Using the Arduino IDE, install the [firmware](https://github.com/rwaldron/j5-ds-touch/blob/master/firmware/ds_touch_slave.ino) to your AVR based microcontroller of choice. 

### Assembly

![DS Touch μC Backpack](https://github.com/rwaldron/j5-ds-touch/blob/master/assets/ds-touch-backpack.png)


## Connect To I2C Capable Platform

### Arduino UNO

![DS Touch Backpack + Arduino UNO](https://raw.githubusercontent.com/rwaldron/j5-ds-touch/master/assets/ds-touch-backpack-with-uno.png)

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

![DS Touch Backpack + Tessel 2](https://raw.githubusercontent.com/rwaldron/j5-ds-touch/master/assets/ds-touch-backpack-with-tessel-2.png)

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

### Intel Edison MiniBoard

![DS Touch Backpack + Intel Edison MiniBoard](https://raw.githubusercontent.com/rwaldron/j5-ds-touch/master/assets/ds-touch-backpack-with-edison-mini.png)

### Intel Edison Arduino Board

![DS Touch Backpack + Arduino Board](https://raw.githubusercontent.com/rwaldron/j5-ds-touch/master/assets/ds-touch-backpack-with-edison-arduino.png)


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

## Ploma App

This repo comes with a version of @evhan55's example [Ploma](https://github.com/evhan55/ploma) app that has been modified to accept input from a socket instead of a Wacom tablet. 

![Hello Ploma](https://github.com/rwaldron/j5-ds-touch/blob/master/assets/hello-ploma.png)


To Run: 


```sh
node eg/server.js
```



## NOTE

The examples shown here are provided for illustration and do no specifically indicate platform support. This component class is expected to work with any platform that has I2C support. 
