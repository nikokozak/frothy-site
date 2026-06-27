---
title: "Fade an LED"
weight: 7
description: "Use the ESP32 LEDC surface to fade an LED with a named, current-Froth wrapper."
advanced: true
---

This tutorial is board-specific. It uses the ESP32 LEDC bindings exposed by
the source-board path, not the Froth Machine workshop surface. If you are using
the Machine, treat this as reference practice for a lower-level board.

PWM works by switching a pin quickly enough that your eye sees average
brightness. Higher duty means more on-time and a brighter LED.

## Configure LEDC

Use one speed mode, timer, and channel for the tutorial:

```froth
ledc.speed is 0
ledc.timer is 0
ledc.channel is 0
ledc.resolution is 10
ledc.maxDuty is 1023
```

Configure a 1 kHz PWM timer and attach the LED pin:

```froth
ledc.timer-config: ledc.speed, ledc.timer, 1000, ledc.resolution
ledc.channel-config: LED_BUILTIN, ledc.speed, ledc.channel, ledc.timer, 0
```

Now wrap the two-step duty update:

```froth
to ledc.duty! with duty [
  ledc.set-duty: ledc.speed, ledc.channel, duty;
  ledc.update-duty: ledc.speed, ledc.channel
]
```

Test three values:

```froth
ledc.duty!: 0
ledc.duty!: 256
ledc.duty!: ledc.maxDuty
```

## Fade In Software

Start with a simple upward fade:

```froth
to fade.up with step, wait [
  here duty is 0;
  while duty <= ledc.maxDuty [
    ledc.duty!: duty;
    ms: wait;
    set duty to duty + step
  ]
]
```

Then the downward half:

```froth
to fade.down with step, wait [
  here duty is ledc.maxDuty;
  while duty >= 0 [
    ledc.duty!: duty;
    ms: wait;
    set duty to duty - step
  ]
]
```

Run both:

```froth
fade.up: 16, 8
fade.down: 16, 8
```

## Breathe

Compose the two halves:

```froth
to breathe with count [
  repeat count [
    fade.up: 16, 6;
    ms: 120;
    fade.down: 16, 6;
    ms: 240
  ]
]
```

Try it:

```froth
breathe: 5
```

## Hardware Fade

The LEDC binding also exposes the ESP32 fade helper:

```froth
ledc.fade-install:
ledc.fade-with-time: ledc.speed, ledc.channel, 0, 500
ledc.fade-start: ledc.speed, ledc.channel, 0
```

Use the software loop when you are learning or need Froth-level control. Use
the hardware fade when the board should handle the ramp.

When you are done:

```froth
ledc.stop: ledc.speed, ledc.channel, 0
```
