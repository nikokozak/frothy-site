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
depend on the circuit, pull resistors, and selected pin.

## Digital Word Table

| Word | Result | Use |
| --- | --- | --- |
| [`gpio.mode`](/reference/words/#gpio-mode) | `nil` | Set mode `0` for input or `1` for output |
| [`gpio.write`](/reference/words/#gpio-write) | `nil` | Write level `0` or `1` |
| [`pin`](/reference/words/#pin) | `nil` | Alias for `gpio.write` |
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
| [`adc.percent`](/reference/words/#adc-percent) | `Int` | Map the ESP32 0–4095 range to 0–100 |

An unconnected analog pin floats. A stable application circuit needs the
appropriate source impedance, reference, filtering, and calibration; the
language helper cannot replace those physical details.
