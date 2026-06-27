---
title: "09. Talking to Hardware"
description: "Use the base-image board layer first, then climb to Machine display and input helpers."
weight: 9
aliases:
  - /guide/08-hardware-and-the-protoboard/
---

Froth is device-first. The host tools help you reach the board, but the board
is the real environment.

The hardware surface is layered:

- base-image words such as `gpio.*`, `adc.read`, `ms`, `millis`, `led.*`, and
  `blink`
- board-specific convenience words such as `joy.*?`, `knob.*`, `grid.*`, and
  `matrix.*`
- lower-level driver words such as `tm1629.*`, `i2c.*`, `uart.*`, and `ledc.*`
  on boards that expose them

Start as high as you can. Drop lower only when the higher layer no longer says
what you mean.

## GPIO

The raw digital shape is:

```froth
gpio.output: LED_BUILTIN
gpio.high: LED_BUILTIN
ms: 100
gpio.low: LED_BUILTIN
```

The helper words are ordinary Froth definitions over the lower-level FFI
binding:

```froth
gpio.mode: LED_BUILTIN, 1
gpio.write: LED_BUILTIN, 1
gpio.read: LED_BUILTIN
```

Use named pins such as `LED_BUILTIN` and `BOOT_BUTTON` instead of raw numbers.
The board metadata seeds those names into the base image.

## ADC

Analog input is board-specific but follows the same idea:

```froth
adc.read: A0
adc.percent: A0
```

On the Froth Machine, the friendly layer names the two knobs:

```froth
knob.left:
knob.right:
knob.left.raw:
knob.right.raw:
```

Use percentage helpers for sketches. Use raw readings when you are calibrating
or debugging.

## Froth Machine Display And Controls

For the Machine, initialize the display once:

```froth
matrix.init:
matrix.brightness!: 1
grid.clear:
grid.show:
```

Then work through the canvas layer:

```froth
grid.set: 4, 3, true
grid.show:
```

Read the joystick through booleans:

```froth
joy.up?:
joy.down?:
joy.left?:
joy.right?:
joy.click?:
```

Those helpers configure and sample the underlying GPIO pins for you.

## Board Availability

The first public protoboard on this site is the TM1629-based
`esp32-devkit-v4-game-board`. It is the board behind the [Machine](/machine/)
and [Workshop](/workshop/) sections.

The `esp32-devkit-v1` source board remains useful for lower-level hardware
examples such as I2C, UART, and LEDC/PWM. Those pages are reference material,
not the beginner Machine path.

Next: [Snapshots and persistence](/guide/10-snapshots-and-persistence/).
