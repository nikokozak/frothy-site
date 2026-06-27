---
title: "Drive a Servo"
weight: 9
description: "Generate hobby-servo pulses with LEDC and wrap the low-level timing in readable Froth words."
advanced: true
---

This is a lower-level ESP32 tutorial. It is not part of the Froth Machine
workshop path. Use a source board that exposes the LEDC bindings, a powered
hobby servo, and a signal pin that is safe for your board.

A hobby servo expects a pulse about every 20 ms. The pulse width encodes the
position: roughly 1.0 ms for one side, 1.5 ms for center, and 2.0 ms for the
other side. Exact ranges vary by servo.

## Choose The Pin And Channel

```froth
servo.pin is 18
servo.speed is 0
servo.timer is 1
servo.channel is 1
servo.resolution is 16
servo.freq is 50
```

At 50 Hz, one period is 20 ms. With 16-bit duty, the full period is `65535`.
One millisecond is about `3277` duty counts.

```froth
servo.min is 3277
servo.center is 4915
servo.max is 6553
```

## Configure PWM

```froth
ledc.timer-config: servo.speed, servo.timer, servo.freq, servo.resolution
ledc.channel-config: servo.pin, servo.speed, servo.channel, servo.timer, servo.center
```

Wrap duty updates:

```froth
to servo.duty! with duty [
  ledc.set-duty: servo.speed, servo.channel, duty;
  ledc.update-duty: servo.speed, servo.channel
]
```

Move to the center:

```froth
servo.duty!: servo.center
```

## Named Positions

Keep the dangerous numbers in one place:

```froth
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

```froth
servo.left:
ms: 500
servo.middle:
ms: 500
servo.right:
```

If the servo chatters or strains, stop and narrow the min/max range before
continuing.

## Sweep

```froth
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

```froth
servo.sweep:
```

## Map A Knob Or Sensor

If you have an analog input, map `0..100` percent to the servo duty range:

```froth
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

This is the current-Froth shape the old servo tutorial was reaching for: hide
the peripheral math behind names, test the safe positions first, then connect
input to motion.
