---
title: "CLI"
weight: 1
description: "The current `frothy` command surface: bootstrap, doctor, flash, connect, session, fetch, build, and recovery."
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

**`frothy flash`** flashes the packaged release firmware for a board identifier.
From a Frothy source checkout, it builds and flashes that checkout instead.

```sh
frothy flash esp32_devkit_v1 --port /dev/cu.usbserial-0001
```

Official board identifiers are:

- `esp32_devkit_v1`
- `seeed_xiao_esp32c3`
- `seeed_xiao_esp32c6`
- `seeed_xiao_esp32s3`
- `seeed_xiao_rp2040`
- `arduino_nano_rp2040_connect`

**`frothy connect`** opens the simple serial REPL.

```sh
frothy connect
```

**`frothy session`** opens the session transport. Add `--records` to emit the
structured NDJSON path used by editor tooling.

```sh
frothy session --records
```

Structured response records preserve device notices. A notice response has
`status: "ok"` and `ok: true`, keeps the complete raw response in `text`, and
may include the canonical notice headline in an optional `notice` field.
Editor integrations should render that as a warning, keep source progress
moving, and reserve error state for a response whose `ok` field is false.

A `compile_error` record reports source that `frothy` refused before it sent a
line, for example a form longer than the device line (`line_bytes` in
`status`). It has no `ok` field, and the session stays open.

The human wire shapes and all stable numeric categories are listed under
[Error and notice codes](/errors/).

**`frothy send`** reads a source file and sends each complete form in file
order, with one exception: each `boot is` form moves after the forms around it,
so a file can call words that it defines further down. A `boot` form never
moves past a `save`, so the save stores it. `frothy send` checks every form
against the device line before the first send.

```sh
frothy send main.fr
frothy send main.fr --dry-run
```

## Interrupt And Save To Device

Inside `frothy connect`, press Ctrl-C to interrupt running code without closing
the serial session. Run `save` at the Frothy prompt to save the current overlay
to the device; run `restore` to load it again.

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

**`frothy fetch`** pre-fetches git dependencies without building.

```sh
frothy fetch
```

**`frothy install`** sends project library source to the board's library tier.

```sh
frothy install --port /dev/cu.usbserial-0001
```

Install preserves device notices. A response such as `notice: not saved (13)`
and its `detail:` lines is printed to stderr without an `error:` prefix, then
the next source form is sent. Notices alone leave the command with exit status
zero; a true device or transport error still stops installation and returns a
nonzero status.

`frothy install` ends with `install-user`, so the board is back in the user
tier and later definitions are user words.

Changing a library while a program is on the board is not safe yet. A
library that comes again gives its words new slots, so words that the board
compiled before answer `wrong type (2)` or run a different library word, and
a later `save` can answer `corrupt data (11)`. Until a fix, change a library
in this order: `wipe-user`, then `frothy install`, then send the program and
`save`. If a library already changed under a program, do not `save`: run
`dangerous.wipe`, then `frothy install`, then send the program.

If you type `install-library` yourself, send `install-user` when the library
is in: in library mode, a definition after `wipe-user` can answer
`corrupt data (11)`, and only `dangerous.wipe` recovers.

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
