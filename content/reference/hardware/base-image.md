---
title: "Base Image"
weight: 1
description: "Seeded pins, timing, GPIO, LED, and ADC helpers that live in the board base image."
---

These entries cover the shared board/base-image layer that Frothy seeds at
boot.

## Pins and Constants

**`LED_BUILTIN`, `A0`, `BOOT_BUTTON`, and board-specific pins`** *(base image)*

Layer: `base image`  
Behavior: Board metadata seeds named pins and board constants into the base
image so code can refer to hardware by stable names instead of raw integers.
On the TM1629 protoboard that also includes display, joystick, button, and
potentiometer pin names.  
Example:

```frothy
gpio.output: LED_BUILTIN
adc.read: A0
```

## Timing and GPIO Primitives

**`millis`, `ms`, `gpio.mode`, `gpio.write`, `gpio.read`** *(base image)*

Layer: `base image`  
Behavior: The primitive timing and GPIO surface: read uptime, sleep for a
duration, configure a pin, write a pin, and read a pin.  
Example:

```frothy
millis:
gpio.mode: LED_BUILTIN, 1
gpio.write: LED_BUILTIN, 1
gpio.read: LED_BUILTIN
ms: 75
```

## Base-Library Helpers

**`gpio.input`, `gpio.output`, `gpio.high`, `gpio.low`, `gpio.toggle`** *(board library)*

Layer: `board library`  
Behavior: Frothy-native helper words layered on top of the raw GPIO primitives
to make everyday board interaction readable.  
Example:

```frothy
gpio.output: LED_BUILTIN
gpio.toggle: LED_BUILTIN
```

**`blink`, `animate`** *(board library)*

Layer: `board library`  
Behavior: Tiny timing helpers baked into the base image for workshop and
board-library work. `blink` drives a pin for a count and wait interval.
`animate` repeatedly runs a step function.  
Example:

```frothy
blink: LED_BUILTIN, 3, 75
animate: 8, 40, fn with i [ led.toggle: ]
```

## LED and ADC Helpers

**`led.pin`, `led.on`, `led.off`, `led.toggle`, `led.blink`** *(board library)*

Layer: `board library`  
Behavior: Convenience words for the board's default LED wiring.  
Example:

```frothy
led.on:
led.blink: 3, 75
```

**`adc.read`, `adc.max`, `adc.percent`** *(base image / board library)*

Layer: `base image`  
Behavior: Raw ADC input plus the Frothy-native percentage helper layered on top
of it.  
Example:

```frothy
adc.read: A0
adc.percent: A0
```
