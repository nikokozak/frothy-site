---
title: "Install"
aliases:
  - /guide/00-installation/
description: "Build the early Frothy toolchain, check it, flash an ESP32, and connect."
---

Frothy is still early. There is no polished installer yet. For now, the honest path is to clone the repo, build the `frothy` command, let it fetch the ESP32 toolchain, and then talk to a board over USB serial.

The command you will use is:

```text
frothy
```

## What You Need

- macOS or Linux
- Go 1.22 or newer
- `git`, `make`, and a C compiler
- an ESP32 development board with USB serial
- Chrome, Edge, VS Code, or any terminal/editor you like

Windows is not a supported local CLI path yet.

## Build Frothy

Clone the source and build the CLI:

```sh
git clone https://github.com/nikokozak/FrothyRewrite
cd FrothyRewrite
make cli
```

`make cli` builds the `frothy` command. If the build prints a `PATH` line, add that to your shell profile or run it in the current terminal before continuing.

Check that the command is visible:

```sh
frothy --help
```

## Bootstrap The ESP32 Toolchain

The first ESP32 build needs Espressif's ESP-IDF toolchain. Let Frothy install it into your user directory:

```sh
frothy bootstrap
```

This is a one-time download and setup step. It installs under `~/.froth/` by default, uses no `sudo`, and can take a while.

If you need to start over:

```sh
frothy bootstrap --force
```

## First Check

Run the doctor before flashing anything:

```sh
frothy doctor
```

`doctor` checks the host build, flash tooling, and serial setup. It should not change the board or your files.

## Flash An ESP32

Plug in your board and find its serial port. On macOS it often looks like:

```text
/dev/cu.usbserial-0001
```

Then flash the firmware:

```sh
frothy flash esp32_devkit_v1 --port /dev/cu.usbserial-0001
```

`esp32_devkit_v1` is the board identifier Frothy currently uses for the ESP32 development board shape used during development. It is not meant to imply that only that exact retail board can work. Most classic Tensilica ESP32 development boards with USB serial should be plausible. Newer RISC-V ESP32 variants have not been tried yet.

If only one serial device is attached, Frothy may be able to find it. Passing `--port` is clearer when you are learning.

## Connect

Once the board is flashed, open the prompt:

```sh
frothy connect --port /dev/cu.usbserial-0001
```

Try one harmless line:

```frothy
status
```

Then try the built-in LED:

```frothy
led.on:
ms: 250
led.off:
```

If that works, the hard part is done. Most day-to-day Frothy work happens with `connect`, `session`, `send`, and your editor. You do not flash for every small change.

## Start A Small Project

`frothy init` scaffolds the current directory. Make a folder first:

```sh
mkdir my-sketch
cd my-sketch
frothy init
```

That creates a tiny project with `frothy.toml` and `main.fr`. Send it to a connected board:

```sh
frothy send main.fr --port /dev/cu.usbserial-0001
```

## VS Code

The VS Code extension is built from the same repo:

```sh
make vsix
code --install-extension editors/vscode/frothy-0.2.1.vsix
```

If VS Code cannot find the command, set `frothy.binaryPath` to the absolute path of the `frothy` binary you built.

## Browser Tools

There are also browser-based tools for WebSerial. They are useful when you want to try the flasher or editor without setting up VS Code. Use a desktop browser with WebSerial support, such as Chrome or Edge.

## What To Read Next

- [Getting Started](/guide/02-getting-started/) walks through your first prompt.
- [Blink an LED](/tutorials/blink-an-led/) gives you the smallest hardware proof.
- [CLI](/reference/cli/) lists the current command surface.
