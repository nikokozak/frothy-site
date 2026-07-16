---
title: "PWM"
weight: 11
description: "ESP32 PWM words for opening a channel, setting duty, and closing it."
advanced: true
---

Use this page when you need the ESP32 PWM handle contract.

PWM is the ESP32 LEDC peripheral exposed in Frothy as `pwm.*`. It is useful
for LED brightness and servo-style pulses, but it is not part of the first
LED/button tutorial path. The canonical word entries are in the
[Word Catalog](/reference/words/).

`pwm.open` returns a Handle: a tagged Frothy value that names a runtime
handle-table entry, which in turn names the live LEDC channel. It is neither an
integer nor an ESP-IDF pointer. Handles are volatile, so close the channel and
rebind its top-level name before `save`; reopen it from `boot` after restore.

## Word Table

| Word | Args | Result | Behavior |
| --- | --- | --- | --- |
| [`pwm.open`](/reference/words/#pwm-open) | 2 | `Handle` | Open a PWM channel on a pin at a frequency in Hz. |
| [`pwm.write`](/reference/words/#pwm-write) | 2 | `nil` | Set duty for an open channel in the inclusive range `0` to `10000`. |
| [`pwm.close`](/reference/words/#pwm-close) | 1 | `nil` | Release an open PWM channel handle. |

## Open

`pwm.open` decodes a pin and frequency as unsigned 16-bit values, reserves a
runtime handle, asks the platform to open the channel, and returns the handle.
If platform open or handle activation fails, the reserved handle is released.

## Write

`pwm.write` requires a live PWM handle and an integer duty. The runtime accepts
duty values from `0` through `10000`; values outside that range are a domain
error. The duty scale is the Frothy contract, independent of the ESP-IDF
resolution used below it.

## Close

`pwm.close` requires a live PWM handle, closes the platform channel through the
handle table, releases the handle, and returns `nil`.

## Relationship To Tutorials

The [Fade an LED tutorial](/tutorials/fade-an-led/) shows a Frothy-level
software fade built on these words.
