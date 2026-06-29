---
title: "Drive a Servo"
weight: 9
description: "Generate hobby-servo pulses with LEDC and wrap the low-level timing in readable Frothy words."
advanced: true
---

This is a lower-level ESP32 tutorial. It is not part of the Frothy board
first LED/button path. Use an ESP32 board that exposes the LEDC bindings, a powered
hobby servo, and a signal pin that is safe for your board.

A hobby servo expects a pulse about every 20 ms. The pulse width encodes the
position: roughly 1.0 ms for one side, 1.5 ms for center, and 2.0 ms for the
other side. Exact ranges vary by servo.

## Choose The Pin And Channel

```frothy
servo.pin is 18
servo.speed is 0
servo.timer is 1
servo.channel is 1
servo.resolution is 16
servo.freq is 50
```

At 50 Hz, one period is 20 ms. With 16-bit duty, the full period is `65535`.
One millisecond is about `3277` duty counts.

```frothy
servo.min is 3277
servo.center is 4915
servo.max is 6553
```

## Configure PWM

```frothy
ledc.timer-config: servo.speed, servo.timer, servo.freq, servo.resolution
ledc.channel-config: servo.pin, servo.speed, servo.channel, servo.timer, servo.center
```

Wrap duty updates:

```frothy
to servo.duty! with duty [
  ledc.set-duty: servo.speed, servo.channel, duty;
  ledc.update-duty: servo.speed, servo.channel
]
```

Move to the center:

```frothy
servo.duty!: servo.center
```

## Named Positions

Keep the dangerous numbers in one place:

```frothy
to servo.left [
  servo.duty!: servo.min
]

to servo.middle [
  servo.duty!: servo.center
]

to servo.right [
  servo.duty!: servo.max
]
```

Try them slowly:

```frothy
servo.left:
ms: 500
servo.middle:
ms: 500
servo.right:
```

If the servo chatters or strains, stop and narrow the min/max range before
continuing.

## Sweep

```frothy
to servo.sweep [
  repeat 4 [
    servo.left:;
    ms: 500;
    servo.middle:;
    ms: 500;
    servo.right:;
    ms: 500;
    servo.middle:;
    ms: 500
  ]
]
```

Run it:

```frothy
servo.sweep:
```

## Map A Knob Or Sensor

If you have an analog input, map `0..100` percent to the servo duty range:

```frothy
to servo.fromPercent with percent [
  servo.min + ((clamp: percent, 0, 100) * (servo.max - servo.min) / 100)
]

to servo.followA0 [
  repeat 600 [
    servo.duty!: servo.fromPercent: (adc.percent: A0);
    ms: 20
  ]
]
```

This is the current-Frothy shape the old servo tutorial was reaching for: hide
the peripheral math behind names, test the safe positions first, then connect
input to motion.
