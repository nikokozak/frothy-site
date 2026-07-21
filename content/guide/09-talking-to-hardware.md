---
title: "09. Talking to Hardware"
description: "Move from GPIO into events, buses, networking, Bluetooth, signals, and power."
weight: 9
aliases:
  - /guide/08-hardware-and-the-protoboard/
icon: circuit-board
readTime: "9 min"
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

The base library defines those helpers over the board pin and its active level:

```frothy
to led.on [ gpio.write: $led_builtin, $led_active_level ]
to led.off [ gpio.write: $led_builtin, 1 - $led_active_level ]
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

## Events And Interrupts

Use [Events](/reference/modules/events/) for timers, GPIO edges, and Wi-Fi
lifecycle changes that should keep running after the prompt returns. GPIO edge
candidates may begin in an interrupt, but Frothy dispatches the registered body
later at a safe point. Use Ctrl-C when you instead need to interrupt foreground
evaluation.

## Wi-Fi, HTTP, And TCP

Store credentials once, connect, and test readiness:

```frothy
wifi.save: "network-name", "network-password"
wifi.connect:
wifi.ready?:
```

`http.get` returns transient Bytes for a bounded one-shot response. TCP uses a
live Handle for streaming. The [Wi-Fi, HTTP & TCP guide](/reference/modules/wifi/)
covers reconnect events, limits, cleanup, and persistence.

## Bluetooth Low Energy

BLE-enabled firmware can scan, advertise, connect, and act as either side of a
small GATT conversation:

```frothy
ble.on:
ble.info:
```

Bluetooth is capability-gated, so check for `ble.on` in `words`. The
[Bluetooth Low Energy guide](/reference/modules/bluetooth/) covers central and
peripheral roles, raw diagnostics, queues, handles, and current limits.

## The Rest Of The Board Surface

- [I2C](/reference/modules/i2c/) — sensors, raw transfers, and register helpers
- [UART](/reference/modules/uart/) — auxiliary serial byte streams
- [PWM](/reference/modules/pwm/) — periodic output and duty control
- [Digital signals](/reference/modules/signals/) — edge capture and finite pulse output
- [Power](/reference/modules/power/) — watchdog supervision and deep sleep
- [Console routing](/reference/modules/console/) — move and recover the human REPL
- [Math & random](/reference/modules/math-and-random/) — bounded integer helpers

The [Modules guide](/reference/modules/) is the complete feature map and links
each area to its exact word-catalog entries.

Next: [Snapshots and persistence](/guide/10-snapshots-and-persistence/).
