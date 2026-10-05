---
title: "Interactive Profile"
weight: 1
description: "REPL behavior, multiline input, interrupts, inspection, and the control-session path."
aliases:
  - /reference/interactive-profile/
icon: terminal
tags: [repl, multiline, interrupts]
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

```frothy
1 + 1
```

**`multiline input`** *(interactive profile)*

Layer: `core`  
Behavior: Keeps accumulating input while delimiters remain open. Incomplete
input includes unclosed `(`, `[`, or string literals.  
Example:

```frothy
to blink with pin [
  gpio.high: pin;
  wait: 75;
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

**`words`, `see`, `status`** *(interactive profile)*

Layer: `core`  
Behavior: Inspect the live image through prompt-facing built-ins. `words` lists
the names that exist, `see` renders a binding's source form, and `status`
reports the session and runtime.  
Example:

```frothy
words
see boot
see blink
```

## Structured Tooling Sessions

**`frothy session --records`** *(tooling session)*

Layer: host tool  
Behavior: Tools use the same prompt as a person; the device has no separate
control mode. `frothy session --records` sends source to the prompt and writes
one NDJSON record for each event: a send, a response, a refused form, an
interrupt.  
Example:

```text
frothy session --records
```

**`extension-owned helper session`** *(editor path)*

Layer: host tool  
Behavior: The VS Code extension starts one `frothy session --records` child
process, and that process owns the serial port. There is no daemon and no
second owner of the port in the maintained Frothy editor path.
Example:

```text
VS Code connect, send line, send file, interrupt, and simple inspection all go through that one session.
```

## Capability Layers

The interactive surface is only one part of Frothy:

- the core language: values, names, calls, blocks, control flow, `Cells`, and `Code`
- the prompt: evaluation, multiline input, interrupts, inspection, `save`, and `restore`
- tooling sessions: editor and CLI control paths over the same device-owned image
- board words: GPIO, ADC, I2C, UART, PWM, and other hardware words when the current board firmware exposes them

For day-one work, you do not need to memorize those layers. You need the prompt, `words`, `see`, `led.on:`, `led.off:`, and a willingness to try one small line at a time.
