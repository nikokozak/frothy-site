---
title: "CLI"
weight: 1
description: "The current `frothy` command surface: bootstrap, doctor, flash, connect, session, send, build, and recovery."
aliases:
  - /reference/cli/
icon: terminal
tags: [frothy, flash, connect]
---

The public command is `frothy`. It is still early, but the core verbs are usable.

## First Commands

**`frothy bootstrap`** installs the ESP-IDF toolchain under your Frothy home directory.

```sh
frothy bootstrap
frothy bootstrap --force
```

**`frothy doctor`** checks the local build, flash, and serial setup. It should not modify the board.

```sh
frothy doctor
```

**`frothy flash`** builds and flashes firmware for a board identifier.

```sh
frothy flash esp32_devkit_v1 --port /dev/cu.usbserial-0001
```

`esp32_devkit_v1` is the development-board identifier used in Frothy today. Most classic Tensilica ESP32 dev boards with USB serial should be plausible; newer RISC-V ESP32 variants have not been tried yet.

**`frothy connect`** opens the simple serial REPL.

```sh
frothy connect
```

**`frothy session`** opens the richer session path used by editor tooling.

```sh
frothy session
```

**`frothy send`** compiles a source file and sends definitions or expressions line by line.

```sh
frothy send main.fr
frothy send main.fr --dry-run
```

## Project Commands

**`frothy init`** scaffolds the current directory. Make the directory yourself first.

```sh
mkdir my-sketch
cd my-sketch
frothy init
```

**`frothy build`** resolves libraries and builds firmware artifacts.

```sh
frothy build
```

**`frothy install`** sends project library source to the board's library tier.

```sh
frothy install --port /dev/cu.usbserial-0001
```

## Recovery Commands

**`frothy wipe`** erases persisted device state on a wedged ESP32. It requires `--force`.

```sh
frothy wipe esp32_devkit_v1 --port /dev/cu.usbserial-0001 --force
```

**`frothy wipe-user`** clears user-tier definitions while leaving installed library code in place.

```sh
frothy wipe-user
```

**`frothy stop`** stops Frothy sessions that are holding serial ports.

```sh
frothy stop
```

## Not Ready Yet

`frothy fetch` appears in the command surface as a placeholder for future dependency fetching. Do not build a workflow around it yet.
