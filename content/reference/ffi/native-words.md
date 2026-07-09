---
title: "Native words"
weight: 3
description: "Add Frothy words backed by C through a library manifest."
aliases:
  - /reference/ffi/how-it-works/
  - /reference/ffi/project-ffi/
  - /reference/ffi/board-ffi-example/
  - /reference/ffi/project-ffi-example/
advanced: true
tags: [libraries, native, c]
---

Native words are Frothy words whose implementation is compiled from C. They are
part of a library. There is no separate foreign-call syntax.

`lib.toml` adds `[extension]` for C sources and one `[[natives]]` block per C
word:

```toml
name    = "neopixel"
version = "0.1.0"
targets = ["esp32_devkit_v1"]

[extension]
sources = ["native/neopixel.c"]

[[natives]]
name       = "neopixel.show"
arity      = 1
c_function = "fr_lib_neopixel_show"
```

- `[extension].sources` lists `.c` files, with paths relative to the library root.
- Each `[[natives]]` maps a Frothy word `name` and `arity` to a C function.
- Native word names usually look like `<lib>.<word>`. They may contain letters,
  digits, `.`, `_`, and `-`, but may not start with `-` or a digit.

## C ABI

A native C function has exactly this signature:

```c
#include "runtime.h"
#include "tagged.h"
#include "types.h"

fr_err_t fr_lib_neopixel_show(fr_runtime_t *runtime, const fr_tagged_t *args,
                              uint8_t arg_count, fr_tagged_t *out) {
  fr_int_t count = 0;
  FR_TRY(fr_tagged_decode_int(args[0], &count));
  /* ... drive the hardware ... */
  return fr_tagged_encode_int(count, out);
}
```

The return type is `fr_err_t`. The parameters are fixed:
`(fr_runtime_t *runtime, const fr_tagged_t *args, uint8_t arg_count,
fr_tagged_t *out)`.

Values cross the boundary as tagged values. Decode integer arguments with
`fr_tagged_decode_int(args[i], &n)`, where `n` is `fr_int_t`. Test values with
`fr_tagged_is_int`, `fr_tagged_is_nil`, `fr_tagged_is_bool`, or
`fr_tagged_is_falsy`. Produce results by writing `*out` with
`fr_tagged_encode_int(v, out)` or `fr_tagged_encode_bool(b, out)`.

`FR_TRY(expr)` propagates a non-OK `fr_err_t`.

## Generated Build Files

The C compiles into the firmware. `frothy build` runs a generator that writes
derived files under `.frothy/build/<target>/`:

- `lib_natives.c`, a table binding each native word name to its C function
- `libs.cmake`, the extension sources and includes for the firmware build

Do not edit generated files by hand.

## Persistence

Values that cross the boundary are Int, Bool, Nil, and, where a word supports
it, Text or Bytes. Raw pointers and driver handles are not persistable Frothy
values. Expose a small integer handle instead.

Native words live in the firmware base image. A saved overlay references them by
name. At boot, the native implementation is rebuilt from firmware, so saved
images stay pointer-safe.
