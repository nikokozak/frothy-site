---
title: "GPIO"
weight: 5
description: "Digital pin input and output words, plus the Frothy helper layer over them."
---

GPIO is the shared digital I/O surface. Use the helper words for ordinary
programs, and the raw words when you are documenting or debugging the board
boundary.

## Availability

The current public examples assume an ESP32 board flashed with the Frothy firmware. GPIO behavior depends on the board and the pin you choose, so start with the built-in LED and boot button before wiring more.

## Raw Words

**`gpio.mode:`** *(gpio)* `(pin, mode) -> nil`

Configures pin direction. `1` means output. `0` means input.

```frothy
gpio.mode: $led_builtin, 1
gpio.mode: $boot_button, 0
```

**`gpio.write:`** *(gpio)* `(pin, level) -> nil`

Writes a digital output level.

```frothy
gpio.write: $led_builtin, 1
gpio.write: $led_builtin, 0
```

**`gpio.read:`** *(gpio)* `(pin) -> Int`

Reads a digital input level. Most board helpers convert this to a `Bool` when
the electrical meaning is known.

```frothy
gpio.read: $boot_button
```

## Helper Words

The base library defines readable wrappers:

```frothy
gpio.input: $boot_button
gpio.output: $led_builtin
gpio.high: $led_builtin
gpio.low: $led_builtin
gpio.toggle: $led_builtin
```

Prefer helpers in tutorials and application code. They keep the code about the
intent rather than the numeric mode or level.

## Active-Low Inputs

Many buttons read `0` when pressed:

```frothy
to boot.pressed? [
  (gpio.read: $boot_button) == 0
]
```

Name that conversion once. Do not spread active-low electrical details through
the rest of the program.
