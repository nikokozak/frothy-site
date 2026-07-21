---
title: "Modules"
weight: 3
url: /reference/modules/
aliases:
  - /reference/hardware/
description: "Start with a complete example, then narrow into every built-in Frothy module and its words."
icon: boxes
tags: [gpio, wifi, i2c, ble]
guideTopic: true
---

Module pages explain how a whole area fits together. Each starts with the common
path, gives a complete example, explains state and limits, and ends with links
to the exact entries in the [word catalog](/reference/words/).

## Begin With The Board

- [Board constants & helpers](/reference/modules/board/) — named pins, the
  built-in LED, and the small source library available at boot
- [GPIO & ADC](/reference/modules/gpio/) — digital input/output and analog
  readings
- [Timing](/reference/modules/timing/) — interruptible sleeps and uptime clocks
- [Events](/reference/modules/events/) — timers, GPIO edges, Wi-Fi lifecycle,
  cancellation, and asynchronous output

## Work With Data

- [Math & random](/reference/modules/math-and-random/) — integer mapping,
  clamping, square roots, wrapping, and repeatable pseudo-random values
- [Text, Bytes & PAD](/reference/modules/text-bytes-pad/) — persistent text,
  transient I/O bytes, and the 64-byte scratch pad

## Connect Hardware

- [I2C](/reference/modules/i2c/) — buses, raw byte transfers, and register
  helpers
- [UART](/reference/modules/uart/) — auxiliary serial ports and byte I/O
- [PWM](/reference/modules/pwm/) — frequency channels and 0–10000 duty
- [Digital signals](/reference/modules/signals/) — edge capture and precisely
  timed pulse output
- [Console input & routing](/reference/modules/console/) — read a line as data,
  move the human REPL to a selected UART, and recover the default route

## Connect Networks

- [Wi-Fi, HTTP & TCP](/reference/modules/wifi/) — stored credentials, lifecycle
  events, one-shot HTTP reads, and streaming TCP handles
- [Bluetooth Low Energy](/reference/modules/bluetooth/) — scan, advertise,
  connect, and use local or remote GATT
- [Power](/reference/modules/power/) — watchdog supervision, GPIO wake, and deep
  sleep

The ESP32 plain profile exposes the full surface documented here. Smaller or
custom profiles may omit modules; `words` on the device is authoritative for
the firmware in front of you.

I/O modules return transient `Bytes` and live `Handle` values. Copy bytes with
`text.pack` when they must persist. Close handles and remove them from project
slots before `save`, then reopen required resources from `boot`.
