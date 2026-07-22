---
title: "Fade an LED"
weight: 7
description: "Use the ESP32 PWM surface to fade an LED with a named, current-Frothy wrapper."
advanced: true
---

This tutorial is board-specific. It uses the ESP32 PWM bindings exposed by
the ESP32 path, not the first LED/button tutorial path. If you are using
a first board, treat this as an advanced ESP32 exercise.

PWM works by switching a pin quickly enough that your eye sees average
brightness. Higher duty means more on-time and a brighter LED.

## Open a PWM Handle

Open one PWM channel on the built-in LED pin at 1 kHz. `pwm.open` returns a
handle you pass back into later calls:

```frothy
led is pwm.open: $led_builtin, 1000
```

Set the duty with `pwm.write`:

```frothy
pwm.write: led, 0
pwm.write: led, 256
pwm.write: led, 512
```

## Fade In Software

Start with a simple upward fade:

```frothy
to fade.up with handle, step, delay [
  here duty is 0;
  while duty <= 1023 [
    pwm.write: handle, duty;
    wait: delay;
    set duty to duty + step
  ]
]
```

Then the downward half:

```frothy
to fade.down with handle, step, delay [
  here duty is 1023;
  while duty >= 0 [
    pwm.write: handle, duty;
    wait: delay;
    set duty to duty - step
  ]
]
```

Run both:

```frothy
fade.up: led, 16, 8
fade.down: led, 16, 8
```

## Breathe

Compose the two halves:

```frothy
to breathe with handle, count [
  repeat count [
    fade.up: handle, 16, 6;
    wait: 120;
    fade.down: handle, 16, 6;
    wait: 240
  ]
]
```

Try it:

```frothy
breathe: led, 5
```

When you are done, close the handle:

```frothy
pwm.close: led
```
