---
title: "Read a Button"
weight: 3
description: "Read a digital input, turn it into a boolean, and use it to control visible state."
---

The LED tutorial drove an output. This one reads an input. A button is the cleanest first input because it only has two states: pressed or not pressed.

On many ESP32 DevKit-style boards, the BOOT button is active-low. Released reads high. Pressed reads low.

## Read The Built-In Button

```frothy
gpio.mode: $boot_button, 0
gpio.read: $boot_button
```

Hold the button and read again. The value should change from `1` to `0`.

Wrap the electrical detail in a name:

```frothy
to boot.pressed? [
  (gpio.read: $boot_button) == 0
]
```

## Light The LED While Pressed

```frothy
to button.frame [
  if boot.pressed?: [
    led.on:
  ] else [
    led.off:
  ]
]

repeat 300 [
  button.frame:;
  ms: 20
]
```

Hold the button. The LED should follow your hand.

## Detect One Press

```frothy
button.prev is false
button.led is false

to button.fell? [
  here now is boot.pressed?:;
  here hit is now and (not button.prev);
  set button.prev to now;
  hit
]

to button.toggle-frame [
  when button.fell?: [
    set button.led to not button.led;
    if button.led [ led.on: ] else [ led.off: ]
  ]
]

repeat 1000 [
  button.toggle-frame:;
  ms: 20
]
```
