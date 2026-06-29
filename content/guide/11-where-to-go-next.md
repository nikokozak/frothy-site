---
title: "11. Where to Go Next"
description: "Move from the guide into tutorials, reference, hardware, or FFI."
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

- [Word reference](/reference/words/) for core syntax and values
- [Interactive profile](/reference/interactive-profile/) for prompt behavior, interrupts, and inspection
- [Image and persistence](/reference/image-and-persistence/) for `save`, `restore`, and recovery
- [Hardware](/reference/hardware/) for ESP32-facing words
- [CLI](/reference/cli/) and [Editor](/reference/editor/) for tooling

## If You Are Extending Frothy

Read [FFI and C](/guide/12-ffi-and-c/) next, then the [FFI reference](/reference/ffi/). Native extensions are a build-time C path for the cases where Frothy code really needs a hardware or performance helper.

## Design Differences

Read [How Frothy Is Different](/what-makes-frothy-different/) for the deeper design notes: live image, coherent redefinition, recovery, small-device discipline, lexical values, and named places.
