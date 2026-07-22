---
title: "Project and Build"
weight: 2
description: "Current project files, `frothy init`, library manifests, build output, and flashing policy."
aliases:
  - /reference/project-and-build/
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
board = "esp32_devkit_v1"
```

Official board identifiers are `esp32_devkit_v1`, `seeed_xiao_esp32s3`, and
`seeed_xiao_esp32c6`.

## Build And Flash

```sh
frothy build
frothy flash esp32_devkit_v1 --port /dev/cu.usbserial-0001
```

Do not flash after every small change. The ordinary loop is connect, edit,
inspect, revise.

## Libraries

```toml
name = "stage-lights"
board = "esp32_devkit_v1"

[deps]
servo = { git = "https://github.com/nikokozak/frothy-servo", rev = "1efa9e4a661216183e012f4cf0df400d1f72006a" }
blink = { path = "libs/blink" }
```

A dependency is either `git`, with `rev` set to a commit SHA or `branch` set to
a branch name, or `path`, pointing at a local directory relative to the project.
`frothy build` resolves dependencies, fetches git dependencies, and compiles
them in. `frothy fetch` pre-fetches git dependencies without building.

## Native Extensions

```toml
name = "neopixel"
version = "0.1.0"
boards = ["esp32_devkit_v1"]

[extension]
sources = ["native/neopixel.c"]

[[natives]]
name = "neopixel.show"
arity = 1
c_function = "fr_lib_neopixel_show"
```

This is not dynamic plugin loading. The C files are compiled into the firmware build, and the generated native table gives Frothy named words that call those C functions.

Generated build files live under `.frothy/build/...`. Treat them as derived state, not source you edit by hand.
