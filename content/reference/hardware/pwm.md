---
title: "PWM"
weight: 9
url: /reference/modules/pwm/
aliases:
  - /reference/hardware/pwm/
description: "Open a PWM channel, set its 0–10000 duty value, and release the live handle."
icon: waves
tags: [pwm, led, duty]
---

PWM repeatedly switches a pin at a selected frequency. It is useful for LED
brightness, buzzers, and devices that accept a duty-controlled input.

## Fade The Built-In LED

```frothy
channel is pwm.open: $led_builtin, 1000

repeat 21 as i [
  pwm.write: channel, i * 500
  wait: 30
]

pwm.write: channel, 0
pwm.close: channel
set channel to nil
```

The electrical brightness direction follows the LED's polarity. On an
active-low built-in LED, a larger duty may look dimmer rather than brighter.

## Word Table

| Word | Result | Use |
| --- | --- | --- |
| [`pwm.open`](/reference/words/#pwm-open) | `Handle` | Open a channel on a pin at a frequency in Hz |
| [`pwm.write`](/reference/words/#pwm-write) | `nil` | Set duty from `0` through `10000` |
| [`pwm.close`](/reference/words/#pwm-close) | `nil` | Stop output and release the handle |

## Frequency And Duty

```frothy
channel is pwm.open: 4, 5000
pwm.write: channel, 2500  -- 25 percent duty
pwm.write: channel, 7500  -- 75 percent duty
```

The duty scale is always Frothy's inclusive `0..10000` contract. Frequency is
specified in hertz. The target maps those values onto its hardware PWM
peripheral; unsupported pins, frequencies, or exhausted channels return an
error.

`pwm.write` changes the duty of an open channel. Values below `0` or above
`10000` are rejected rather than clamped.

## Which Pins Can PWM

Any output-capable GPIO can carry PWM — the ESP32 routes its PWM peripheral
through the pin matrix, so there is no special "PWM pin" set the way there
is for analog input. Two limits still apply on the ESP32 DevKit V1:

- **Input-only pins can't.** GPIO 34, 35, 36, and 39 have no output driver;
  opening PWM on them fails.
- **GPIO 6–11 are wired to the SPI flash chip.** They count as output-capable,
  so `pwm.open` accepts them — but driving them corrupts the firmware's own
  flash bus and typically crashes the board. Never use them.

A pin already held by an open channel reports `busy` for a different
frequency, and plain `gpio.write` / `gpio.mode` on it also report `busy`
(a digital write would silently detach the pin from its PWM signal). An
exact repeat of the same `pwm.open` returns the existing handle. Hardware
channels are limited — four concurrent channels on the shipped builds — so
`pwm.open` beyond that returns an error until one is closed.

## Handle Lifetime

`pwm.open` returns a volatile `Handle`. Close it before reusing the pin or
saving the project, then replace every top-level handle binding with a durable
value such as `false` or `nil`.

```frothy
channel is false

to dimmer.open [
  set channel to pwm.open: 4, 1000
]

to dimmer.close [
  pwm.close: channel
  set channel to false
]

boot is fn [ dimmer.open: ]
```

For precisely timed, finite high/low spans rather than a repeating duty cycle,
use [Digital signals](/reference/modules/signals/). The [Fade an LED
tutorial](/tutorials/fade-an-led/) develops a complete PWM project.
