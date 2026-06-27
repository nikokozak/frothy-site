---
title: "Project and Build"
weight: 6
description: "Project file names, target versus board selection, build directories, and flashing policy."
aliases:
  - /reference/build-options/
icon: boxes
tags: [frothy.toml, target, board]
---

Froth keeps project selection explicit. A target names the platform. A board
names the concrete board profile under `boards/`.

## Project Shape

**`froth.toml`** *(project manifest)*

Layer: `tooling`  
Behavior: Declares the project inputs the CLI needs to resolve source,
optional project FFI, and target-specific build state.  
Example:

```toml
[project]
name = "blink"
version = "0.1.0"
entry = "src/main.froth"

[target]
board = "esp32-devkit-v1"
platform = "esp-idf"
```

**`src/main.froth`** *(project source)*

Layer: `tooling`  
Behavior: Conventional project entry source file. The editor can send any
current file, but project build/send commands use the manifest shape.

**`.froth-build/`** *(derived build directory)*

Layer: `tooling`  
Behavior: Derived project state. It is not source, and it should not be edited
or committed as a project artifact.

## Target Versus Board

**`--target`** *(CLI flag)*

Layer: `tooling`  
Behavior: Selects the platform layer, such as `posix` or `esp-idf`.  
Example:

```sh
froth --target esp-idf build
```

**`--board`** *(CLI flag)*

Layer: `tooling`  
Behavior: Selects the concrete board profile under `boards/`.  
Example:

```sh
froth --target esp-idf --board esp32-devkit-v1 build
```

Keep those two ideas separate. `esp-idf` is the target platform.
`esp32-devkit-v1` is a board profile.

## Build And Flash

**`froth build`** *(CLI command)*

Layer: `tooling`  
Behavior: Builds the selected project or repo checkout for the selected target
and board. Use `--clean` when target, board, or FFI inputs changed and stale
cache state would make the result ambiguous.

**`froth flash`** *(CLI command)*

Layer: `tooling`  
Behavior: Flashes the selected firmware to the connected device. For ordinary
live work, prefer `connect` and `send`; flashing is for firmware installation,
board recovery, and maintainer workflows.

## Board Files

A maintained board profile is a small set of files:

- `board.json` for capacities and board metadata
- `ffi.c` and `ffi.h` for native board bindings
- `lib/base.froth` or the generated base library surface for startup words

The public language does not expose raw C pointers or native handles as
ordinary persisted values. Board code publishes Froth values and words at the
base-image boundary.

## Build Options

Project builds read build settings from `froth.toml`. The public site should
not promise every internal CMake knob as a stable user flag; the manifest is
the project-level surface.

```toml
[build]
cell_size = 32
heap_size = 8192
slot_table_size = 320
line_buffer_size = 2048
```

Common keys:

| Manifest key | Meaning |
| --- | --- |
| `cell_size` | Runtime cell width in bits for the selected target profile. |
| `heap_size` | Heap size in bytes. |
| `slot_table_size` | Maximum top-level/base-image slot count. |
| `line_buffer_size` | REPL input buffer size in bytes. |

Board profiles may also set evaluator and persistence capacities directly in
`board.json`. Those are maintainer-facing board choices, not knobs most users
should tune while writing Froth.

## Project FFI Build Keys

Project-local C bindings use the `[ffi]` section:

```toml
[ffi]
sources = ["src/ffi/bindings.c"]
includes = ["src/ffi"]
defines = { SENSOR_SCALE = "42" }
```

Validation is intentionally conservative:

- `sources` must exist
- C sources must stay under the project root
- include directories must stay under the project root
- generated bindings are compiled into the firmware, not loaded into a saved
  overlay at runtime

Use [Project FFI](/reference/ffi/project-ffi/) for the exact binding shape.
