---
title: "Read a Sensor"
weight: 4
description: "Read ADC values, scale them, and turn analog input into board behavior."
---

Analog input gives you a range instead of a yes/no answer. On ESP32-class boards the raw ADC reading is usually a count that moves as voltage changes.

Use a potentiometer, sensor breakout, or another safe analog source wired to the board's analog pin.

## Read A Raw ADC Pin

```frothy
adc.read: $a0
```

Turn the potentiometer or change the sensor voltage and read again. The number should move.

## Convert To A Percentage

```frothy
to adc.percent.of with raw [
  raw * 100 / 4095
]

adc.percent.of: (adc.read: $a0)
```

The exact high value depends on ADC configuration and the board. Read real values from your circuit before you depend on precise thresholds.

## Use A Threshold

```frothy
to sensor.high? [
  (adc.percent.of: (adc.read: $a0)) > 50
]

to sensor.frame [
  if sensor.high?: [
    led.on:
  ] else [
    led.off:
  ]
]

repeat 500 [
  sensor.frame:;
  ms: 20
]
```
