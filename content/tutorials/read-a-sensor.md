---
title: "Read a Sensor"
weight: 4
description: "Read ADC values, scale them, and turn analog input into board behavior."
---

Analog input gives you a range instead of a yes/no answer. On ESP32-class
boards the raw ADC reading is usually a 12-bit count from `0` to `4095`.

On the Froth Machine, the easiest analog sensors are already mounted: the left
and right knobs.

## Read A Raw ADC Pin

On a general board:

```froth
adc.read: A0
```

Turn the potentiometer or change the sensor voltage and read again. The number
should move.

Convert a raw count to a percentage:

```froth
to adc.percent.of with raw [
  raw * 100 / 4095
]

adc.percent.of: (adc.read: A0)
```

The board library already provides the usual helper:

```froth
adc.percent: A0
```

Use the helper unless you are teaching or debugging the conversion.

## Read The Machine Knobs

On the Froth Machine:

```froth
knob.left:
knob.right:
knob.left.raw:
knob.right.raw:
```

The `knob.left` and `knob.right` helpers return a percentage-style value on the
`0..100` scale. The `.raw` forms return the ADC sample.

## Map A Sensor To A Pixel

Initialize the display:

```froth
matrix.init:
matrix.brightness!: 1
```

Scale the left knob to an x coordinate:

```froth
to knob.x [
  (knob.left:) * (grid.width - 1) / 100
]
```

Draw one frame:

```froth
sensor.frame is fn [
  grid.clear:;
  grid.set: knob.x:, 3, true;
  grid.show:
]
```

Run it:

```froth
repeat 300 [
  sensor.frame:;
  ms: 25
]
```

Turn the knob. The lit pixel should move across the display.

## Add A Threshold

Thresholds are clearer when named:

```froth
alert.threshold is 70
```

Light the built-in LED when the knob crosses the threshold:

```froth
alert.frame is fn [
  if (knob.left:) > alert.threshold [
    led.on:
  ] else [
    led.off:
  ]
]
```

Run both the display and LED behavior in one frame:

```froth
sensor.alertFrame is fn [
  sensor.frame:;
  alert.frame:
]
```

That is the analog input pattern: read the raw world, scale it to the range
your program uses, and keep the conversion in one named place.
