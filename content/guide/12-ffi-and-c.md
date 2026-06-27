---
title: "12. FFI and C"
description: "How C bindings enter the base image, when to use project FFI, and what the value boundary allows."
weight: 12
aliases:
  - /guide/09-extending-with-ffi/
advanced: true
---

The FFI is the boundary between Froth values and C code. It is deliberately
narrow. That narrowness is what lets a live, persistent image stay legible.

Foreign bindings appear as ordinary top-level `Code` values in the base image:

```froth
gpio.write: LED_BUILTIN, 1
ms: 250
adc.read: A0
```

From the Froth side, a foreign binding is just callable code with a name,
arity, result type, help text, and ownership metadata. The fact that C runs on
the other side is an implementation detail until you are writing the binding.

## What Crosses The Boundary

The first public boundary is value-oriented:

- `Int`
- `Bool`
- `Nil`
- `Text`, where supported by the binding

Native runtime pointers, driver handles, interrupt tokens, and internal
control objects do not become ordinary persistable Froth values. When a C
binding needs a handle, it should normally expose a small integer handle or
hide the native object behind board-owned state.

That is why `i2c.init` can return a bus handle, but the raw ESP-IDF pointer is
not a Froth value.

## Project FFI

Use project FFI when one project needs a small C surface:

```toml
[ffi]
sources = ["src/ffi/bindings.c"]
includes = ["src/ffi"]
defines = { SENSOR_SCALE = "42" }
```

Project FFI should be boring:

- source files stay under the project root
- generated bindings are registered explicitly
- names should read like normal Froth names
- ownership stays with the firmware build, not with the saved overlay

Project FFI is for "this project needs one native helper." It is not a second
runtime plugin system.

## Board FFI

Use board FFI when the binding is part of a board profile:

```text
boards/esp32-devkit-v4-game-board/ffi.c
boards/esp32-devkit-v4-game-board/lib/base library
```

The C side registers the raw bindings. The board library gives them a humane
Froth surface:

```froth
to gpio.high with pin [ gpio.write: pin, 1 ]
to knob.left [ adc.percent: knob.left.pin ]
```

That split is intentional. C should expose the necessary primitive. Froth
should name the workflow people actually use.

## Persistence Rule

Foreign bindings live in the base image. Saved overlays may reference them by
name, but the native implementation itself is rebuilt from firmware at boot.

That keeps saved images pointer-safe. If a saved word calls `gpio.write`, the
restored image resolves `gpio.write` against the rebuilt base slot.

## Where To Read Next

Use the [FFI reference](/reference/ffi/) for the exact project manifest shape,
generated binding names, public C aliases, and examples.

Use [Project and Build](/reference/project-and-build/) when the question is
how the CLI selects targets, boards, source files, and build directories.
