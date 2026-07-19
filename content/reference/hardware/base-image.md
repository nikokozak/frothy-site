---
title: "Board Constants & Helpers"
weight: 1
url: /reference/modules/board/
aliases:
  - /reference/hardware/base-image/
description: "The named pins, literals, GPIO helpers, LED helpers, and small source library installed at boot."
icon: circuit-board
tags: [board, pins, led]
---

Every firmware image starts with core words, target-native words, board
constants, and a small Frothy source library. This page is the map of that
ready-to-use layer.

## First Example

```frothy
gpio.output: $led_builtin
led.blink: 3, 75
adc.percent: $a0
```

The constants let the same source describe intent without copying pin numbers.
The helpers are ordinary Frothy words layered over the raw native surface.

## Board Constants

| Name | Meaning |
| --- | --- |
| [`$led_builtin`](/reference/words/#led-builtin) | Built-in LED pin |
| [`$led_active_level`](/reference/words/#led-active-level) | Electrical level that turns the built-in LED on |
| [`$boot_button`](/reference/words/#boot-button) | Board boot-button pin |
| [`$a0`](/reference/words/#a0) | Default analog input |
| [`$sda`](/reference/words/#sda) | Default I2C data pin |
| [`$scl`](/reference/words/#scl) | Default I2C clock pin |

The two supported ESP32 board definitions install the same names but may bind
them to different pin numbers or LED polarity. Use the names unless the circuit
requires a specific pin.

## GPIO Helpers

The raw primitives are `gpio.mode`, `gpio.write`, and `gpio.read`. The source
library adds intent-revealing wrappers:

```frothy
gpio.output: 4
gpio.high: 4
gpio.toggle: 4
gpio.low: 4
gpio.input: 4
```

[`pin`](/reference/words/#pin) is an alias for `gpio.write`.

## Built-In LED Helpers

The LED helpers account for the board's active level:

```frothy
led.on:
led.toggle:
led.off:
led.blink: 3, 75
```

Use `blink: pin, count, wait_ms` when you want the same behavior on another
pin.

## ADC, Math, And Random Helpers

The source library also installs:

- [`adc.percent`](/reference/words/#adc-percent), mapping a raw 0–4095 read to
  0–100
- [`wrap`](/reference/words/#wrap), safe modulo for cyclic indexes
- [`sign`](/reference/words/#sign), producing -1, 0, or 1
- [`random.chance?`](/reference/words/#random-chance) and
  [`random.percent?`](/reference/words/#random-percent)

These definitions live in the base image and can be inspected on the device:

```frothy
see led.blink
see adc.percent
```

Go to [GPIO & ADC](/reference/modules/gpio/) for the electrical I/O contract or
the [word catalog](/reference/words/) for every exact signature.
