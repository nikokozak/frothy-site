---
aliases:
  - /what-makes-froth-different/
title: "How Frothy Is Different"
description: "Why Frothy treats a programmable device as a live, inspectable system."
---

Frothy sits near languages such as uLisp, small Forth systems, MicroPython, Lua ports, and board monitor shells. It is meant for the same broad territory: small programs that you can change while a device is connected.

Its design makes a different set of tradeoffs. Frothy treats the running image as the place where the program lives, keeps the language surface small, and makes inspection part of ordinary work.

## No Stack-Centric Public Model

Many compact interactive languages lean on a visible stack, a Lisp evaluator, or a host-shaped scripting model. Frothy uses names, calls, lexical locals, and ordinary values as the public model.

The user-facing center is:

- stable named slots
- lexical locals
- `Code` as an ordinary value
- explicit places and mutations

That keeps the language inspectable and persistable without translating every concept through stack effects or a larger general-purpose runtime.

## Stable Slot Identity Is The Real Top Level

At top level, a name refers to a stable slot identity. Rebinding changes the slot's current value, not the slot itself.

That choice keeps live redefinition coherent because existing callers continue to resolve through the same slot. Recovery also stays concrete: the base image can rebuild the same slot set instead of depending on hidden host state.

## Hardware Is Explicit

Frothy does not pretend that every board has the same pins or peripherals. The examples on this site use the current ESP32 development-board path. If a program uses GPIO, ADC, I2C, UART, or PWM, that dependency should be visible in the code and in the setup notes.

That is less magical, but kinder to beginners. A missing wire, wrong pin, or unsupported peripheral should look like a hardware question, not a language mystery.

## `Code` Is Lexical And Non-Capturing

Frothy `Code` values use lexical name resolution and do not capture outer locals.

The tradeoff is intentional. It keeps the image, persistence, and inspection story small enough to reason about on a device.

## Persistence Is Explicit And Recoverable

Frothy makes persistence part of the public interactive contract:

- `save` snapshots the overlay image
- `restore` rebuilds that overlay image
- wipe commands clear persisted state when you need a harder reset
- safe boot exists to recover from bad saved state

The image is the state that matters, not a daemon cache or a host-side shadow runtime.

A saved program lives in the board's flash, not its scratch RAM. That means the
size of what you can build is bounded by flash — measured in megabytes on a
typical board — rather than by the small pool of working memory. RAM only has to
hold what you are actively editing, so you can keep real programs and libraries
on the device and get them back exactly as you left them after a reboot.

## Inspection Is Part Of Ordinary Work

Frothy treats `words`, `see`, `status`, and memory/status commands as part of the normal prompt surface. That matters when the device image is authoritative: you need to be able to ask what is present and what a name resolves to.

## Device-First, Tool-Thin

Frothy is embedded-device-first. Host tools make connected work faster, but they are not the product center.

That also shows up in the control surface:

- raw REPL by default
- richer sessions for tooling
- no daemon required to preserve state
- editor tooling built as a thin client over the device-owned image
