---
title: "11. Where to Go Next"
description: "Move from the guide into tutorials, reference, hardware, or extending Frothy."
weight: 11
aliases:
  - /guide/10-where-to-go-next/
icon: compass
readTime: "2 min"
---

The guide gives you the model. The next page depends on what you are trying to do.

## If You Want A Task

Use [Tutorials](/tutorials/) when you want one result at a time:

- [Blink an LED](/tutorials/blink-an-led/) for the smallest hardware proof
- [Read a Button](/tutorials/read-a-button/) for digital input
- [Read a Sensor](/tutorials/read-a-sensor/) for analog input
- [Fade an LED](/tutorials/fade-an-led/) when you are ready for PWM
- [Build a Calculator](/tutorials/build-a-calculator/) for named state without more wiring

## If You Need Exact Behavior

Use [Reference](/reference/) when the wording has to be exact:

- [Frothy in Y Minutes](/reference/language/) for the complete language
- [Word catalog](/reference/words/) to search every current word
- [Interactive profile](/reference/device/interactive-profile/) for prompt behavior, interrupts, and inspection
- [Image and persistence](/reference/device/image-and-persistence/) for `save`, `restore`, and recovery
- [Modules](/reference/modules/) for GPIO, Wi-Fi, I2C, BLE, and every other ESP32 area
- [CLI](/reference/toolchain/cli/) and [Editor](/reference/toolchain/editor/) for tooling

## If You Are Extending Frothy

Read [Libraries and Native Words](/guide/12-ffi-and-c/) next, then the
[Extending reference](/reference/ffi/). Start with pure Frothy libraries. Use
native words only when a library really needs C.

## Design Differences

Read [How Frothy Is Different](/what-makes-frothy-different/) for the deeper design notes: live image, coherent redefinition, recovery, small-device discipline, lexical values, and named places.
