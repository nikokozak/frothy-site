---
title: "PWM"
weight: 11
description: "ESP32 PWM words for opening a channel, setting duty, and closing it."
advanced: true
---

PWM (the ESP32 LEDC peripheral, exposed in Frothy as `pwm.*`) is an ESP32
surface. It is useful for LED brightness and servo-style pulses, but it is not
part of the first LED/button tutorial path.

Handles are small integers returned by `pwm.open` and passed back into later
calls. Native ESP-IDF pointers do not become Frothy values.

## Words

**`pwm.open:`** *(pwm)* `(pin, freq) -> Int`

Opens a PWM channel on a pin at a frequency in Hz and returns a handle.

```frothy
led is pwm.open: $led_builtin, 1000
```

**`pwm.write:`** *(pwm)* `(handle, duty) -> nil`

Sets the duty for an open channel.

```frothy
pwm.write: led, 512
```

**`pwm.close:`** *(pwm)* `(handle) -> nil`

Closes the channel and releases the handle.

```frothy
pwm.close: led
```

The [Fade an LED tutorial](/tutorials/fade-an-led/) shows a Frothy-level
software fade built on these words.
