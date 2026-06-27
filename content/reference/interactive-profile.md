---
title: "Interactive Profile"
weight: 2
description: "REPL behavior, multiline input, interrupts, inspection, and the control-session path."
aliases:
  - /reference/profiles/
---

This page covers the maintained prompt-facing and tool-facing interactive
surface.

## Prompt and Evaluation

**`REPL`** *(interactive profile)*

Layer: `core`  
Behavior: Reads top-level forms, evaluates complete input, prints the result of
top-level expression evaluation, and keeps the prompt alive on recoverable
errors.  
Example:

```froth
1 + 1
```

**`multiline input`** *(interactive profile)*

Layer: `core`  
Behavior: Keeps accumulating input while delimiters remain open. Incomplete
input includes unclosed `(`, `[`, or string literals.  
Example:

```froth
to blink with pin [
  gpio.high: pin;
  ms: 75;
  gpio.low: pin
]
```

## Interrupts and Recovery

**`Ctrl-C`** *(interactive profile)*

Layer: `core`  
Behavior: Interrupts the current running evaluation or pending multiline input
and returns the prompt to a usable state. The maintained evaluator checks for
interrupts at safe points.  
Example:

```text
Press Ctrl-C during a loop or during multiline entry.
```

**`safe boot`** *(interactive profile)*

Layer: `core`  
Behavior: Lets you skip restore and `boot` during startup so you can recover
from bad saved state, inspect the image, and repair or wipe it.  
Example:

```text
Press Ctrl-C during the safe-boot window, then inspect `boot` and run `dangerous.wipe` if needed.
```

## Inspection Commands

**`words`, `show`, `see`, `core`, `info`** *(interactive profile)*

Layer: `core`  
Behavior: Inspect the live image through prompt-facing built-ins. `show` and
`see` route to the normalized binding view; `core` is debug-oriented; `info`
reports metadata such as owner, kind, and persistability.  
Example:

```froth
words
show @boot
info @matrix.init
```

## Structured Tooling Sessions

**`.control`** *(control session)*

Layer: `core`  
Behavior: Switches the prompt into an exclusive structured control session for
host tooling. Raw REPL is the default human surface; structured control is an
explicit tool-owned mode.  
Example:

```text
The host tool opens the port, acquires the prompt, sends `.control`, and then uses framed control messages.
```

**`extension-owned helper session`** *(editor path)*

Layer: `core`  
Behavior: The VS Code extension owns a helper child process which owns one
control session at a time. There is no daemon and no concurrent shared port
owner in the maintained Froth editor path.
Example:

```text
VS Code connect, send line, send file, interrupt, and simple inspection all ride on the helper-owned control session.
```

## Capability Layers

The interactive profile is only one layer of the public surface:

- the core language: values, names, calls, blocks, control flow, `Cells`, and
  `Code`
- the interactive profile: prompt evaluation, multiline input, interrupts,
  inspection, `save`, `restore`, and `dangerous.wipe`
- tooling sessions: editor and CLI control paths over the same device-owned
  image
- board capabilities: GPIO, ADC, display, input, I2C, UART, or LEDC when the
  selected board profile exposes them

The old `profiles` page mixed language features with build-time capability
selection. Current Froth keeps the split explicit: the language model is stable
across targets, while the board surface depends on the selected base image.
