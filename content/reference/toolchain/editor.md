---
title: "Editor"
weight: 3
description: "VS Code and browser editor support for running forms and files, inspecting live words, and interrupting the board."
aliases:
  - /reference/editor/
  - /reference/vscode/
icon: pen-line
tags: [vs code, send, inspect]
---

You do not need a special editor to use Frothy. Any editor plus `frothy send file.fr` works.

The VS Code extension is a convenience layer over `frothy session`. It sends source, asks the device for inspection data, and leaves the live image on the board.

## Install VS Code Support

Frothy is not listed in the Marketplace yet. From the Frothy repo, build and
install the current VSIX directly:

```sh
make vsix
code --install-extension editors/vscode/frothy-0.4.0.vsix
```

A Marketplace install updates through VS Code. A release-asset `.vsix` is a
manual download and install. The extension handles `.fr` and `.frothy` files.

## Useful Commands

- `Frothy: Connect`
- `Frothy: Disconnect`
- `Frothy: Run Form`
- `Frothy: Run File`
- `Frothy: Rerun`
- `Frothy: Open Example`
- `Frothy: Browse Words`
- `Frothy: Inspect Word`
- `Frothy: Show Status`
- `Frothy: Memory`
- `Frothy: Save Overlay`
- `Frothy: Restore Overlay`
- `Frothy: Interrupt`
- `Frothy: Show Output`

## Shortcuts

```text
Cmd/Ctrl+Enter          Run Form
Cmd/Ctrl+Shift+Enter    Run File
Cmd/Ctrl+Alt+R          Rerun
Cmd/Ctrl+Alt+.          Interrupt while running
```

**Save to Device** uses `Frothy: Save Overlay` to persist the device's current
definitions. `Frothy: Restore Overlay` reloads that saved state.

## Settings

**`frothy.binaryPath`** is an optional absolute path to the `frothy` binary.

**`frothy.port`** is an optional preferred serial port.

**`frothy.baud`** is the serial baud rate.

**`frothy.autoConnect`** controls automatic connection.

## Browser Editor

The [browser editor](/editor/) uses WebSerial and runs Frothy straight from the
page. Use Chrome or Edge on desktop.

- **Examples** — the picker in the header loads any of the bundled examples into the buffer. The same set is available in VS Code via `Frothy: Open Example`.
- **Connect / Run** — Connect opens the WebSerial picker. Run Form sends one selected complete form or the form around the cursor. Run File sends every complete form in order and stops at the first device error.
- **Browse Words** — asks the connected device for its current vocabulary, then runs `see` for the word you choose.
- **Interrupt** — sends a Ctrl-C to stop a running program (a `forever` loop), without disconnecting.
- **Split** — toggles the MCU output between sitting below the editor and beside it; the choice is remembered.
- **Autosaved locally** — edits are saved in this browser automatically. If storage fails, the editor says so and keeps Download `.fr` available.
- **Open / Download** — Open `.fr` replaces the scratchpad and preserves its filename for the next download.
- **Errors** — Run File stops at the first device error, and diagnostic detail stays grouped with the error.

## Recovery

If a program runs away, use the editor interrupt command or press Ctrl-C in a terminal session. If saved state is bad after reboot, use the CLI recovery commands from the [CLI reference](/reference/toolchain/cli/).
