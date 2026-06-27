---
title: "Project FFI"
weight: 2
description: "How project-local C bindings are declared, built, and registered."
---

Project FFI is the build-time path for application-owned C bindings. It lets
one project compile its own C files alongside the runtime without turning those
words into board-level API.

## Manifest Contract

Project FFI is declared under `[ffi]` in `froth.toml`:

```toml
[ffi]
sources = ["src/ffi/bindings.c"]
includes = ["src/ffi"]
defines = { SENSOR_SCALE = "42" }
```

The fields mean:

- `sources`: project-local `.c` files
- `includes`: include directories passed to the compiler
- `defines`: preprocessor definitions

If `[ffi]` is absent, no project FFI is built.

## Required Export

Project FFI must export:

```c
const froth_ffi_entry_t froth_project_bindings[]
```

The name is fixed because the boot path looks for that project binding table
when project FFI is enabled.

## CLI Build Path

When `froth build` runs in a project:

1. the manifest is loaded
2. `[ffi]` is resolved and validated
3. the CLI writes `.froth-build/project_ffi.cmake`
4. CMake receives `-DFROTH_PROJECT_FFI_CONFIG=...`
5. the project C files are compiled into the selected target
6. project bindings are installed at boot

`froth send` does not rebuild project FFI. It evaluates Froth source against
the already-running image.

## Validation Rules

The manifest checks are deliberately strict:

- `[ffi]` cannot declare includes or defines without sources
- every source must exist
- every source must be a `.c` file
- every source must stay under the project root
- every include path must exist
- every include path must be a directory
- every include path must stay under the project root
- define keys must be valid C identifiers
- define values cannot contain newlines, semicolons, or quotes

That keeps project manifests from quietly injecting arbitrary build behavior.

## Ownership Boundary

Use project FFI for words like:

- protocol codecs
- application-specific math helpers
- wrappers around one project's SDK dependency
- performance-sensitive primitives that only one firmware owns

Do not put those words in board FFI unless every project for that board should
inherit them.

The intended layering is:

- board FFI for target-owned hardware words
- board library code for target-owned Froth wrappers
- project FFI for app-owned C
- project Froth for the actual program
