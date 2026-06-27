---
title: "CLI"
weight: 4
description: "The maintained `froth` command surface and attendee-versus-maintainer paths."
---

The public command is `froth`. Use it for environment checks, direct prompt
sessions, source sends, project builds, and device flashing.

## Identity and Naming

**`Froth product / froth CLI`** *(tooling surface)*

Layer: `core`  
Behavior: Product, docs, release assets, Homebrew formula, and VS Code surface
use `Froth` / `froth`.
Example:

```sh
froth --version
froth doctor
```

## Core Commands

**`froth doctor`** *(CLI)*

Layer: `core`  
Behavior: Checks the maintained machine and device path before you try to work
through the prompt or editor.  
Example:

```sh
froth doctor
froth --port <path> doctor
```

**`froth new`** *(CLI)*

Layer: `core`
Behavior: Creates a Froth project with `froth.toml`, `src/main.froth`, and the
selected target and board.
Example:

```sh
froth new blink --target esp-idf --board esp32-devkit-v1
```

**`froth setup esp-idf`** *(CLI)*

Layer: `core`
Behavior: Installs the optional ESP-IDF toolchain used for custom ESP32 builds
and flashing.
Example:

```sh
froth setup esp-idf
```

**`froth connect`** *(CLI)*

Layer: `core`  
Behavior: Opens the direct prompt path to the connected board. Use it when the
editor path is blocked or when you want a raw interactive session.  
Example:

```sh
froth --port <path> connect
```

**`froth send`** *(CLI)*

Layer: `core`  
Behavior: Sends source to the connected target for evaluation. This is part of
the normal live workflow, not a separate deployment-only path.  
Example:

```sh
froth send src/main.froth
```

**`froth build`** *(CLI)*

Layer: `core`  
Behavior: Builds the selected project target. This is the sanctioned project
path when you need a board build rather than only a live prompt session.  
Example:

```sh
froth build
```

**`froth flash`** *(CLI)*

Layer: `core`  
Behavior: Flashes firmware to the connected board. Use it when you need to
recover or install firmware, not as a replacement for ordinary live
redefinition.  
Example:

```sh
froth --port <path> flash
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
