---
title: "CLI"
weight: 4
description: "The maintained `frothy` command surface and attendee-versus-maintainer paths."
icon: terminal
tags: [frothy, flash, connect]
---

The public command is `frothy`. Use it for environment checks, direct prompt
sessions, source sends, project builds, and device flashing.

## Identity and Naming

**`Frothy product / frothy CLI`** *(tooling surface)*

Layer: `core`  
Behavior: Product, docs, release assets, Homebrew formula, and VS Code surface
use `Frothy` / `frothy`.
Example:

```sh
frothy --version
frothy doctor
```

## Core Commands

**`frothy doctor`** *(CLI)*

Layer: `core`  
Behavior: Checks the maintained machine and device path before you try to work
through the prompt or editor.  
Example:

```sh
frothy doctor
frothy --port <path> doctor
```

**`frothy new`** *(CLI)*

Layer: `core`
Behavior: Creates a Frothy project with `frothy.toml`, `src/main.frothy`, and the
selected target and board.
Example:

```sh
frothy new blink --target esp-idf --board esp32-devkit-v1
```

**`frothy setup esp-idf`** *(CLI)*

Layer: `core`
Behavior: Installs the optional ESP-IDF toolchain used for custom ESP32 builds
and flashing.
Example:

```sh
frothy setup esp-idf
```

**`frothy connect`** *(CLI)*

Layer: `core`  
Behavior: Opens the direct prompt path to the connected board. Use it when the
editor path is blocked or when you want a raw interactive session.  
Example:

```sh
frothy --port <path> connect
```

**`frothy send`** *(CLI)*

Layer: `core`  
Behavior: Sends source to the connected target for evaluation. This is part of
the normal live workflow, not a separate deployment-only path.  
Example:

```sh
frothy send src/main.frothy
```

**`frothy build`** *(CLI)*

Layer: `core`  
Behavior: Builds the selected project target. This is the sanctioned project
path when you need a board build rather than only a live prompt session.  
Example:

```sh
frothy build
```

**`frothy flash`** *(CLI)*

Layer: `core`  
Behavior: Flashes firmware to the connected board. Use it when you need to
recover or install firmware, not as a replacement for ordinary live
redefinition.  
Example:

```sh
frothy --port <path> flash
```

## Maintained Paths

**`attendee path versus maintainer path`** *(tooling policy)*

Layer: `core`  
Behavior: The attendee path is intentionally narrow: released CLI, matching
VSIX, preflashed board. The maintainer path includes source builds, broader
tests, and board-target development from the repo.  
Example:

```sh
make build
make test
make test-publishability
```
