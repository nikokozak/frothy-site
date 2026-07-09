---
title: "Editor"
weight: 3
description: "VS Code and browser editor support for connecting, sending source, inspecting words, and interrupting the board."
aliases:
  - /reference/editor/
  - /reference/vscode/
icon: pen-line
tags: [vs code, send, inspect]
---

You do not need a special editor to use Frothy. Any editor plus `frothy send file.fr` works.

The VS Code extension is a convenience layer over `frothy session`. It sends source, asks the device for inspection data, and leaves the live image on the board.

## Install VS Code Support

From the Frothy repo:

```sh
make vsix
code --install-extension editors/vscode/frothy-0.2.1.vsix
```

The extension handles `.fr` and `.frothy` files.

## Useful Commands

- `Frothy: Connect`
- `Frothy: Disconnect`
- `Frothy: Run Line`
- `Frothy: Send Selection`
- `Frothy: Run Last Form`
- `Frothy: Send File`
- `Frothy: Open Example`
- `Frothy: See Word`
- `Frothy: List Words`
- `Frothy: Show Status`
- `Frothy: Memory`
- `Frothy: Save Overlay`
- `Frothy: Restore Overlay`
- `Frothy: Interrupt`
- `Frothy: Show Output`

## Shortcuts

```text
Shift+Enter             run current line
Cmd/Ctrl+Enter          run selection, or current line
Cmd/Ctrl+Alt+R          run last form
Cmd/Ctrl+Shift+Enter    send current file
Cmd/Ctrl+Alt+B          see word under cursor
Cmd/Ctrl+Alt+.          interrupt device
```

## Settings

**`frothy.binaryPath`** is an optional absolute path to the `frothy` binary.

**`frothy.port`** is an optional preferred serial port.

**`frothy.baud`** is the serial baud rate.

**`frothy.autoConnect`** controls automatic connection.

## Browser Editor

The browser editor uses WebSerial and runs a Frothy sketch straight from the page. Use Chrome or Edge on desktop.

- **Examples** — the picker in the header loads any of the bundled examples into the buffer. The same set is available in VS Code via `Frothy: Open Example`.
- **Connect / Send** — Connect picks your board from the WebSerial dialog. Send line runs the current line; Send buffer runs the whole sketch (comment and blank lines are stripped, the way `frothy send` delivers a file).
- **Interrupt** — sends a Ctrl-C to stop a running program (a `forever` loop), without disconnecting.
- **Split** — toggles the MCU output between sitting below the editor and beside it; the choice is remembered.
- **Autosave** — edits are saved to your browser automatically; the header shows the save state. Download `.fr` exports the sketch as a file you can later `frothy send`.
- **Errors** — a buffer run stops at the first error, and an error's diagnostic detail (name, source, caret, help) is grouped together so it reads as one message.

## Recovery

If a program runs away, use the editor interrupt command or press Ctrl-C in a terminal session. If saved state is bad after reboot, use the CLI recovery commands from the [CLI reference](/reference/toolchain/cli/).
