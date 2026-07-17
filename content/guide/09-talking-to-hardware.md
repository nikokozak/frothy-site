---
title: "09. Talking to Hardware"
description: "Use the ESP32 board layer: LED, GPIO, ADC, timing, and lower-level peripherals when needed."
weight: 9
aliases:
  - /guide/08-hardware-and-the-protoboard/
icon: circuit-board
readTime: "7 min"
---

Frothy is device-first. The host tools help you reach the board, but the board is the real environment.

Start with the small surface: `led.*`, `gpio.*`, `adc.read`, `ms`, and `millis`. Reach for I2C, UART, or PWM only when your circuit needs them.

## The Development Board Identifier

Most examples use:

```text
esp32_devkit_v1
```

That is Frothy's current board identifier for the ESP32 development-board shape used during development. It should be read as "the current ESP32 dev-board path," not "only this exact branded board works." Most classic Tensilica ESP32 development boards with USB serial should be plausible. Newer RISC-V ESP32 variants have not been tried yet.

## LED

```frothy
led.on:
ms: 100
led.off:
```

The base library defines those helpers over the board pin:

```frothy
to led.on [ gpio.high: $led_builtin ]
to led.off [ gpio.low: $led_builtin ]
```

## GPIO

```frothy
gpio.mode: $led_builtin, 1
gpio.write: $led_builtin, 1
ms: 100
gpio.write: $led_builtin, 0
```

Digital input:

```frothy
gpio.mode: $boot_button, 0
gpio.read: $boot_button
```

Many board buttons are active-low: pressed reads `0`, released reads `1`. Name that once in your own code instead of remembering it everywhere.

## ADC

```frothy
adc.read: $a0
```

Treat raw ADC values as something you calibrate. Read a few values, move the sensor or knob, and decide what range matters for your circuit.

## Other Peripherals

Frothy has early I2C, UART, PWM, networking, power, and
[Bluetooth Low Energy](/reference/hardware/bluetooth/) words. They are useful,
but they are not the first lesson. Use the
[hardware reference](/reference/hardware/) when you need exact names and
examples.

Next: [Snapshots and persistence](/guide/10-snapshots-and-persistence/).
