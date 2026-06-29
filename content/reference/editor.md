---
title: "Editor"
weight: 5
description: "VS Code and browser editor support for connecting, sending source, inspecting words, and interrupting the board."
aliases:
  - /reference/vscode/
icon: pen-line
tags: [vs code, send, inspect]
---

You do not need a special editor to use Frothy. Any editor plus `frothy send file.fr --port ...` works.

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

The browser editor uses WebSerial and stores sketches in localStorage. Use Chrome or Edge on desktop.

## Recovery

If a program runs away, use the editor interrupt command or press Ctrl-C in a terminal session. If saved state is bad after reboot, use the CLI recovery commands from the [CLI reference](/reference/cli/).
