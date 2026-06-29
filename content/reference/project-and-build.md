---
title: "Project and Build"
weight: 6
description: "Current project files, `frothy init`, library manifests, build output, and flashing policy."
aliases:
  - /reference/build-options/
icon: boxes
tags: [frothy.toml, build, flash]
---

Most beginners do not need a project on the first day. A prompt and a `.fr` file are enough. Projects matter when you want repeatable files, libraries, firmware builds, or native extension code.

## Project Shape

Create a folder and initialize it:

```sh
mkdir my-sketch
cd my-sketch
frothy init
```

That creates:

```text
frothy.toml
main.fr
.gitignore
libs/
```

A minimal manifest looks like:

```toml
name = "blink"
target = "esp32_devkit_v1"
```

`esp32_devkit_v1` is the board identifier Frothy currently uses for the development ESP32 shape.

## Send A File

```sh
frothy send main.fr
frothy send main.fr --dry-run
```

## Build And Flash

```sh
frothy build
frothy flash esp32_devkit_v1 --port /dev/cu.usbserial-0001
```

Do not flash after every small change. The ordinary loop is connect, send, inspect, revise.

## Libraries

```toml
name = "stage-lights"
target = "esp32_devkit_v1"

[deps]
servo = { path = "libs/servo" }
```

Remote dependency fetching is not ready yet.

## Native Extensions

```toml
name = "neopixel"
version = "0.1.0"
targets = ["esp32_devkit_v1"]

[extension]
sources = ["native/neopixel.c"]

[[natives]]
name = "neopixel.show"
arity = 1
c_function = "fr_lib_neopixel_show"
```

This is not dynamic plugin loading. The C files are compiled into the firmware build, and the generated native table gives Frothy named words that call those C functions.

Generated build files live under `.frothy/build/...`. Treat them as derived state, not source you edit by hand.
