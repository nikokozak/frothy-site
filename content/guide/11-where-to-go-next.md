---
title: "11. Where to Go Next"
description: "Move from the guide into tutorials, Machine, Workshop, reference, or FFI."
weight: 11
aliases:
  - /guide/10-where-to-go-next/
---

The guide gives you the model. The next page depends on what you are trying to
do.

## If You Want A Task

Use [Tutorials](/tutorials/) when you want one visible result at a time:

- [Blink an LED](/tutorials/blink-an-led/) for the smallest hardware proof
- [Read a Button](/tutorials/read-a-button/) for digital input
- [Read a Sensor](/tutorials/read-a-sensor/) for ADC and knob input
- [Build a Calculator](/tutorials/build-a-calculator/) for a local, non-board
  state exercise
- [Build a Small Game](/tutorials/build-a-small-game/) for the Machine loop

Tutorials are allowed to repeat a little. Their job is to get a working shape
under your fingers.

## If You Have A Froth Machine

Go to [Machine](/machine/). It teaches the workshop board as an object you can
use:

- display
- joystick
- knobs
- simple drawing
- small game patterns

Then use [Workshop](/workshop/) for the puzzle-style activity and quick
reference.

## If You Need Exact Behavior

Use [Reference](/reference/) when the wording has to be exact:

- [Word reference](/reference/words/) for core syntax and language values
- [Interactive profile](/reference/interactive-profile/) for prompt behavior,
  interrupts, and inspection
- [Image and persistence](/reference/image-and-persistence/) for `save`,
  `restore`, `dangerous.wipe`, and `boot`
- [Hardware](/reference/hardware/) for board APIs
- [CLI](/reference/cli/) and [Editor](/reference/editor/) for tooling

The reference is not a tutorial. It is the place to check names, arity,
availability, and recovery behavior.

## If You Are Extending Froth

Read [FFI and C](/guide/12-ffi-and-c/) next, then the
[FFI reference](/reference/ffi/). Project FFI is the path for adding
project-local C bindings. Board FFI is the path for firmware-owned board
surfaces.

## Design Differences

Read [How Froth Is Different](/what-makes-froth-different/) for the deeper
design notes: live image, coherent redefinition, recovery, small-device
discipline, lexical values, and named places.

Next: [FFI and C](/guide/12-ffi-and-c/) if you want the extension boundary.
