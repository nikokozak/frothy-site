---
title: "Developer Setup"
weight: 4
description: "Clone Frothy, build its CLI, install ESP-IDF, and produce firmware or editor packages."
icon: code-2
tags: [development, build, esp-idf]
---

This is the source checkout path for firmware and Frothy contributors. Most
users should start with the [browser flasher](https://app.frothy.dev/flash) instead; it needs no
local compiler or ESP-IDF installation.

## Requirements

- macOS or Linux
- Go 1.22 or newer
- `git`, `make`, and a C compiler
- an ESP32 development board with USB serial

Windows is not a supported local CLI build path yet.

## Build The CLI

```sh
git clone https://github.com/nikokozak/frothy
cd frothy
make cli
frothy --help
```

`make cli` prints the directory containing `frothy` if it is not already on
your `PATH`.

## Install The Firmware Toolchain

Firmware development uses Espressif's ESP-IDF. Install it once under
`~/.froth/`:

```sh
frothy bootstrap
frothy doctor
```

Use `frothy bootstrap --force` only when you intentionally want to replace the
local toolchain installation.

## Build And Flash A Board

With one supported board connected:

```sh
frothy flash esp32_devkit_v1
frothy connect
```

When several serial devices are connected, pass the board explicitly:

```sh
frothy flash esp32_devkit_v1 --port /dev/cu.usbserial-0001
```

The browser flasher's release bundle is built from every official board
manifest and each ESP-IDF build's own flash addresses:

```sh
tools/build-flasher-bundle.sh ../app/priv/static/firmware
```

## Local Projects

```sh
mkdir my-sketch
cd my-sketch
frothy init
frothy send main.fr
```

## VS Code Development

Ordinary users can install **Frothy** from the VS Code Marketplace. To test a
local extension build instead:

```sh
make vsix
code --install-extension editors/vscode/frothy-0.4.0.vsix
```

Set `frothy.binaryPath` when the extension cannot find your locally built CLI.
The [editor reference](/reference/toolchain/editor/) describes the commands and
shortcuts.
