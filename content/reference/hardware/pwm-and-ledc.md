---
title: "PWM and LEDC"
weight: 11
description: "ESP32 LEDC words for PWM duty, frequency, fade, and servo-style pulses."
advanced: true
---

PWM/LEDC is a ESP32 ESP32 surface. It is useful for LED brightness and
servo pulses, but it is not part of the first LED/button tutorial path.

## Timer And Channel Setup

**`ledc.timer-config:`** *(pwm/ledc)* `(speed_mode, timer, freq, resolution) -> nil`

Configures one LEDC timer.

```frothy
ledc.timer-config: 0, 0, 1000, 10
```

**`ledc.channel-config:`** *(pwm/ledc)* `(pin, speed_mode, channel, timer, duty) -> nil`

Attaches one pin to one LEDC channel.

```frothy
ledc.channel-config: $led_builtin, 0, 0, 0, 0
```

## Duty And Frequency

**`ledc.set-duty:`** *(pwm/ledc)* `(speed_mode, channel, duty) -> nil`

Sets duty but does not apply it.

**`ledc.update-duty:`** *(pwm/ledc)* `(speed_mode, channel) -> nil`

Applies the duty change.

```frothy
ledc.set-duty: 0, 0, 512
ledc.update-duty: 0, 0
```

**`ledc.get-duty:`** *(pwm/ledc)* `(speed_mode, channel) -> Int`

Reads duty.

**`ledc.set-freq:`** *(pwm/ledc)* `(speed_mode, timer, freq) -> nil`

Changes timer frequency.

**`ledc.get-freq:`** *(pwm/ledc)* `(speed_mode, timer) -> Int`

Reads timer frequency.

**`ledc.stop:`** *(pwm/ledc)* `(speed_mode, channel, idle_level) -> nil`

Stops PWM output for a channel.

## Fade

**`ledc.fade-install:`** *(pwm/ledc)* `() -> nil`

Installs the ESP32 fade helper.

**`ledc.fade-with-time:`** *(pwm/ledc)* `(speed_mode, channel, target_duty, time_ms) -> nil`

Configures a fade.

**`ledc.fade-start:`** *(pwm/ledc)* `(speed_mode, channel, fade_mode) -> nil`

Starts the configured fade.

The [Fade an LED tutorial](/tutorials/fade-an-led/) shows both a Frothy-level
software fade and the hardware fade helper.
