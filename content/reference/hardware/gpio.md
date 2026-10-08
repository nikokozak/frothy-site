---
title: "GPIO & ADC"
weight: 2
url: /reference/modules/gpio/
aliases:
  - /reference/hardware/gpio/
description: "Configure pins, read and write digital levels, watch edges, and sample analog inputs."
icon: toggle-right
tags: [gpio, adc, pins]
---

GPIO is the shortest path from source to a physical result. Start on the
built-in LED and boot button, then move to circuit-specific pins.

## Blink And Read A Button

```frothy
gpio.output: $led_builtin
gpio.input: $boot_button

to show-button [
  if (gpio.read: $boot_button) = 0 [
    led.on:
  ] else [
    led.off:
  ]
]

show-button:
```

The common ESP32 boot button is active-low: pressed reads as `0`. Other inputs
depend on the circuit, pull resistors, and selected pin. The RP2040 boards have
no `$boot_button`, and some boards have no built-in LED; see [Boards](/boards/).

## Pull-Up Inputs

Mode `2` makes a pin an input with its internal pull-up resistor on. Use it for
a button that connects the pin to ground, with no other resistor. The pin reads
`1` when the button is up and `0` when you push it:

```frothy
to button.pressed? with pin [
  gpio.mode: pin, 2
  (gpio.read: pin) = 0
]
```

The modes `0`, `1`, and `2` work on ESP32 and RP2040 boards. Another mode gives
`bad value (3)`.

## Digital Word Table

| Word | Result | Use |
| --- | --- | --- |
| [`gpio.mode`](/reference/words/#gpio-mode) | `nil` | Set mode `0` for input, `1` for output, or `2` for input with the internal pull-up |
| [`gpio.write`](/reference/words/#gpio-write) | `nil` | Write level `0` or `1` |
| [`gpio.read`](/reference/words/#gpio-read) | `Int` | Read digital level |
| [`gpio.input`](/reference/words/#gpio-input) | `nil` | Configure input mode |
| [`gpio.output`](/reference/words/#gpio-output) | `nil` | Configure output mode |
| [`gpio.high`](/reference/words/#gpio-high) | `nil` | Write level `1` |
| [`gpio.low`](/reference/words/#gpio-low) | `nil` | Write level `0` |
| [`gpio.toggle`](/reference/words/#gpio-toggle) | `nil` | Read and invert a level |

The `gpio.*` helpers expose logical levels. Board LED helpers additionally use
`$led_active_level`, so `led.on:` works on both active-high and active-low LEDs.

## React To Edges

Register edge handlers inside a word, then call that word once:

```frothy
to arm-button [
  on $boot_button falling debounce 25 [
    led.toggle:
  ]
]

arm-button:
```

Use `rising`, `falling`, or `changes`. Cancel every GPIO registration for the
pin with `cancel $boot_button`. See [Events](/reference/modules/events/) for
identity, output, and capacity rules.

## Analog Input

```frothy
raw is adc.read: $a0
percent is adc.percent: $a0
above-half? is adc.above?: $a0, 2047
```

| Word | Result | Use |
| --- | --- | --- |
| [`adc.read`](/reference/words/#adc-read) | `Int` | Read the platform ADC value |
| [`adc.above?`](/reference/words/#adc-above) | `Bool` | Compare one reading with a threshold |
| [`adc.percent`](/reference/words/#adc-percent) | `Int` | Map the converter's full range to 0–100 |

Analog reads accept only pins on the chip's first ADC unit; any other pin
fails with `bad value`. A second unit, where the chip has one, is not exposed
when it shares hardware with the radio — reads there fail or return noise
whenever the radio is on. Which pins carry analog input depends on your board
(on the classic ESP32 DevKit V1, for example, GPIO 32–39) — the board's `$a0`
constant always names a safe analog pin.

An unconnected analog pin floats. A stable application circuit needs the
appropriate source impedance, reference, filtering, and calibration; the
language helper cannot replace those physical details.
