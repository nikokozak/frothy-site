---
title: "Editor"
weight: 5
description: "The visible VS Code control surface: connect, send, inspect, interrupt, and recover."
aliases:
  - /reference/vscode/
---

The editor is a thin client over the device-owned image. It does not own a
separate shadow runtime. It opens one helper-owned control session, sends
source, asks the device for inspection data, and gets out of the way.

## Core Commands

**`Connect Device`** *(editor command)*

Layer: `tooling`  
Behavior: Finds or uses the configured serial port, starts the helper, and
enters the structured control session.  
Example:

```text
Froth: Connect Device
```

**`Send Selection / Form`** *(editor command)*

Layer: `tooling`  
Behavior: Sends the current selected text or enclosing form to the connected
device for evaluation. This is the normal edit-loop command.  
Example:

```froth
to pulse with pin [
  gpio.high: pin;
  ms: 75;
  gpio.low: pin
]
```

**`Send File`** *(editor command)*

Layer: `tooling`  
Behavior: Sends the whole file through the reset-and-eval path when supported
by the connected firmware. Use it when you want the file to be the current
session shape rather than one additive form.  
Example:

```text
Froth: Send File
```

**`Interrupt`** *(editor command)*

Layer: `tooling`  
Behavior: Sends the interrupt path to a running evaluation and returns the
editor session to a usable prompt if the target is still responsive.  
Example:

```text
Froth: Interrupt
```

## Inspection

The editor exposes the same inspection surface as the prompt:

- `Words`
- `See Binding`
- `Show Core Binding`
- `Show Slot Info`
- `Save Snapshot`
- `Restore Snapshot`
- `Dangerous Wipe Snapshot`

These commands call into the live target. They do not inspect a stale host-side
copy of the image.

## Settings

**`froth.cliPath`** *(setting)*

Layer: `tooling`  
Behavior: Optional absolute path to the CLI binary. Leave it empty when `froth`
is on `PATH`.

**`froth.port`** *(setting)*

Layer: `tooling`  
Behavior: Optional preferred serial port. Leave it empty to auto-connect when
one supported device is visible or to choose from a prompt when several are
visible.

## Recovery

If the target is running old code or the serial session is unsettled, start
with `Interrupt`. If that does not settle the helper, use `Force Reconnect`.
If saved state is bad after reboot, use the safe-boot path, inspect `boot`, and
run `dangerous.wipe` only when you are intentionally returning to the base
image.

## Extension Identity

The public extension identity is `NikolaiKozak.froth`. If VS Code cannot find
the CLI on `PATH`, set `froth.cliPath` to the absolute path of the installed
binary.

The extension is deliberately thin. Syntax highlighting, send commands,
inspection commands, interrupt, and recovery all point back at the connected
target. There is no hidden host-side interpreter whose state needs to be
reconciled with the board.
