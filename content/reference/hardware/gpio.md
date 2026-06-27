---
title: "GPIO"
weight: 5
description: "Digital pin input and output words, plus the Froth helper layer over them."
---

GPIO is the shared digital I/O surface. Use the helper words for ordinary
programs, and the raw words when you are documenting or debugging the board
boundary.

## Availability

| Surface | Boards |
| --- | --- |
| `gpio.mode`, `gpio.write`, `gpio.read` | ESP32 board profiles and POSIX stubs |
| `gpio.input`, `gpio.output`, `gpio.high`, `gpio.low`, `gpio.toggle` | Board base libraries |

The POSIX target may expose stub behavior so source can be exercised without
physical pins. Hardware behavior requires a board target.

## Raw Words

**`gpio.mode:`** `(pin, mode) -> nil`

Configures pin direction. `1` means output. `0` means input.

```froth
gpio.mode: LED_BUILTIN, 1
gpio.mode: BOOT_BUTTON, 0
```

**`gpio.write:`** `(pin, level) -> nil`

Writes a digital output level.

```froth
gpio.write: LED_BUILTIN, 1
gpio.write: LED_BUILTIN, 0
```

**`gpio.read:`** `(pin) -> Int`

Reads a digital input level. Most board helpers convert this to a `Bool` when
the electrical meaning is known.

```froth
gpio.read: BOOT_BUTTON
```

## Helper Words

The base library defines readable wrappers:

```froth
gpio.input: BOOT_BUTTON
gpio.output: LED_BUILTIN
gpio.high: LED_BUILTIN
gpio.low: LED_BUILTIN
gpio.toggle: LED_BUILTIN
```

Prefer helpers in tutorials and application code. They keep the code about the
intent rather than the numeric mode or level.

## Active-Low Inputs

Many buttons read `0` when pressed:

```froth
to boot.pressed? [
  (gpio.read: BOOT_BUTTON) == 0
]
```

Name that conversion once. Do not spread active-low electrical details through
the rest of the program.
