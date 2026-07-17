---
title: "Hardware"
weight: 3
description: "ESP32 board words for GPIO, ADC, timing, UART, I2C, PWM, and Bluetooth Low Energy."
icon: circuit-board
tags: [gpio, adc, esp32]
---

This section is a lookup table for the hardware words currently worth documenting publicly.

Start with the simple board surface:

- [Base image](/reference/hardware/base-image/) for seeded pins, LED helpers, ADC, timing, and convenience words
- [GPIO](/reference/hardware/gpio/) for digital input and output
- [Timing](/reference/hardware/timing/) for `ms` and `millis`

Then use the more specific peripheral pages only when your circuit needs them:

- [I2C](/reference/hardware/i2c/) for sensors and register-style devices
- [UART](/reference/hardware/uart/) for auxiliary serial devices
- [PWM](/reference/hardware/pwm/) for brightness and servo-style pulse work
- [Bluetooth Low Energy](/reference/hardware/bluetooth/) for scanning,
  advertising, connections, and short GATT values

Examples use `esp32_devkit_v1` because that is the board identifier used during development. It names the development-board shape, not a promise that only that exact retail board can work. Most classic Tensilica ESP32 dev boards should be plausible. Newer RISC-V ESP32 variants have not been tried yet.
