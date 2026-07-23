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

In VS Code, open Extensions, search for **Frothy**, and install the extension
published by **NikolaiKozak**. It updates through VS Code.

For extension development, build and install the current VSIX directly:

```sh
make vsix
code --install-extension editors/vscode/frothy-0.4.0.vsix
```

The extension handles `.fr` and `.frothy` files and requires the `frothy` CLI
on your `PATH` (or at `frothy.binaryPath`).

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

The [browser editor](https://app.frothy.dev/editor) uses WebSerial and runs Frothy straight from the
page. Use Chrome or Edge on desktop.

- **Examples** — the picker in the header loads any of the bundled examples into the buffer. The same set is available in VS Code via `Frothy: Open Example`.
- **Connect / Run** — Connect opens the WebSerial picker and visibly confirms the live profile. Once connected, the button opens a menu with **Browse Words** and **Disconnect**. Run Block sends one selected complete form or the form around the cursor; hovering the gutter shows a play affordance for the block a line belongs to. Run File runs the open file with its local `include` directives spliced in, stopping at the first device error; running `main.fr` clears the board's user definitions first, while any other file runs into the live session.
- **Indent** — Tab and Shift-Tab indent inside the source editor instead of moving focus away.
- **Browse Words** — asks the connected device for its current vocabulary, grouped into board-defined and built-in words; choosing one shows its source in place. Device words also join autocomplete.
- **Pin** — the pushpin in the editor's top corner (or right-clicking a line's gutter) saves one code-block as a one-click rerun button, for the edit-a-definition, rerun-the-driver loop.
- **Interrupt** — sends a Ctrl-C to stop a running program (a `forever` loop), without disconnecting.
- **Split** — toggles the MCU output between sitting below the editor and beside it; the choice is remembered.
- **Autosaved locally** — edits are saved in this browser automatically. If storage fails, the editor says so and keeps Download available.
- **Upload / Download** — the file navigator's upload button adds a `.fr` file to the project; Download packages the project back up.
- **Errors** — Run File stops at the first device error, and diagnostic detail stays grouped with the error.

## Recovery

If the board doesn't answer when you Connect, it is usually running a saved
program (for example a `forever` boot routine): the editor offers **Interrupt
and connect**, which sends a Ctrl-C and then connects normally. If Connect
fails outright, close other applications using the serial port, press the
board's **EN** button (or unplug and reconnect it), and try again. If a program
runs away, use **Interrupt** or press Ctrl-C in a terminal session. If saved
state is bad after reboot, use the CLI recovery commands from the [CLI reference](/reference/toolchain/cli/).
