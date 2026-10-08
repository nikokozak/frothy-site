---
title: "Interactive Profile"
weight: 1
description: "Prompt behavior, multiline forms, interrupts, safe boot, inspection, and the tool session."
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

**`multiline forms`** *(interactive profile)*

Layer: `core`  
Behavior: The board reads one line at a time, and one line holds one form. The
editor, `frothy send`, and `frothy connect` send a form with line breaks as one
line, so a block can span lines. In another serial terminal, write the whole
form on one line, and separate its expressions with `;`.  
Example:

```frothy
to pulse with pin [ gpio.high: pin; wait: 75; gpio.low: pin ]
```

## Interrupts and Recovery

**`Ctrl-C`** *(interactive profile)*

Layer: `core`  
Behavior: Interrupts the running evaluation and returns the prompt to a usable
state. The evaluator checks for interrupts at safe points.  
Example:

```text
Press Ctrl-C during a loop.
```

**`safe boot`** *(interactive profile)*

Layer: `core`  
Behavior: On an ESP32 board, Ctrl-C or the BOOT button in the 600 ms after
start skips restore and `boot`, so a bad saved program cannot keep the prompt
closed. An RP2040 board has no such window; Ctrl-C stops a `boot` that runs.  
Example:

```text
Press Ctrl-C in the safe-boot window. Then run `restore` and `see boot`, or run `dangerous.wipe`.
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
