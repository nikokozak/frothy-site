---
title: "How Froth Is Different"
description: "Why Froth's current language and device model differ from other small programmable-device languages."
---

Froth sits near languages such as uLisp, small Forth systems, MicroPython, Lua
ports, and board-specific monitor shells. It is meant for the same broad
territory: small programs that you can change while a device is connected.

Its design makes a different set of tradeoffs. Froth treats the running image
as the place where the program lives, keeps the language surface small, and
draws clear lines between core language behavior, interactive tooling, and the
capabilities exposed by a selected board profile.

## No Stack-Centric Public Model

Many compact interactive languages lean on a visible stack, a Lisp evaluator,
or a host-shaped scripting model. Froth uses names, calls, lexical locals, and
ordinary values as the public model.

The user-facing center is:

- stable named slots
- lexical locals
- `Code` as an ordinary value
- explicit places and mutations

That keeps the language inspectable and persistable without translating every
concept through stack effects or a larger general-purpose runtime.

## Stable Slot Identity Is The Real Top Level

At top level, a name refers to a stable slot identity. Rebinding changes the
slot's current value, not the slot itself.

That choice keeps live redefinition coherent because existing callers continue
to resolve through the same slot. Recovery also stays concrete: the base image
can rebuild the same slot set instead of depending on hidden host state.

## Capabilities Are Gated By Profiles

Froth does not pretend that every target has the same hardware surface. The
selected target names the platform layer, and the selected board profile
decides which capabilities are present.

That makes hardware access explicit. GPIO, ADC, display, input, I2C, UART, and
LEDC words appear when the board profile exposes them. A tutorial can use the
Froth Machine display and controls without implying that those words are part
of every Froth image.

## `Code` Is Lexical And Non-Capturing

Froth `Code` values use lexical name resolution and do not capture outer
locals.

The tradeoff is intentional. It keeps the image, persistence, and inspection
story small enough to reason about on a device.

## Persistence Is Explicit And Recoverable

Froth makes persistence part of the public interactive contract:

- `save` snapshots the overlay image
- `restore` rebuilds that overlay image
- `dangerous.wipe` clears it and returns to base
- safe boot exists to recover from bad saved state

The image is the state that matters, not a daemon cache or a host-side shadow
runtime.

## Inspection Is Part Of Ordinary Work

Froth treats `words`, `show`, `see`, `core`, and `info` as part of the normal
prompt surface. That matters when the device image is authoritative: you need
to be able to ask what is present, what a name resolves to, and which pieces
can be persisted.

## Device-First, Tool-Thin

Froth is embedded-device-first. Host and local paths make connected work
faster, but they are not the product center.

That also shows up in the control surface:

- raw REPL by default
- explicit exclusive `.control` sessions for tooling
- no daemon required to preserve state
- editor tooling built as a thin client over that device-owned image
