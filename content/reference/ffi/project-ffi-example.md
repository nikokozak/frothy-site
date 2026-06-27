---
title: "Project FFI Example"
weight: 4
description: "A complete project-local FFI example with manifest, C, and Froth code."
---

This example shows the intended project shape: one narrow binding in C, one
`[ffi]` declaration in `froth.toml`, and ordinary Froth code above it.

## Project Layout

```text
my-project/
  froth.toml
  src/
    main.froth
    ffi/
      bindings.c
```

## Manifest

```toml
[project]
name = "ffi-demo"
entry = "src/main.froth"

[target]
board = "posix"
platform = "posix"

[ffi]
sources = ["src/ffi/bindings.c"]
includes = ["src/ffi"]
defines = { SCALE = "2" }
```

## `src/ffi/bindings.c`

```c
#include "froth_ffi.h"

#ifndef SCALE
#define SCALE 2
#endif

static const froth_ffi_param_t scale_twice_params[] = {
    FROTH_FFI_PARAM_INT("value"),
};

static froth_error_t scale_twice(froth_runtime_t *runtime,
                                 const void *context,
                                 const froth_value_t *args,
                                 size_t arg_count,
                                 froth_value_t *out) {
  int32_t value = 0;

  (void)runtime;
  (void)context;
  (void)arg_count;
  FROTH_TRY(froth_ffi_expect_int(args, 0, &value));
  return froth_ffi_return_int(value * SCALE, out);
}

const froth_ffi_entry_t froth_project_bindings[] = {
    {
        .name = "scale.twice",
        .params = scale_twice_params,
        .param_count = FROTH_FFI_PARAM_COUNT(scale_twice_params),
        .arity = 1,
        .result_type = FROTH_FFI_VALUE_INT,
        .help = "Multiply a value by the configured SCALE factor.",
        .flags = FROTH_FFI_FLAG_NONE,
        .callback = scale_twice,
        .stack_effect = "( value -- value )",
    },
    {0},
};
```

## `src/main.froth`

```froth
to clipped-sensor with n
  set scaled = scale.twice: n
  if scaled < 0 [ 0 ]
  else if scaled > 100 [ 100 ]
  else [ scaled ]
end

to boot
  clipped-sensor: 60
end
```

Build the firmware after changing C:

```sh
froth build
```

Send Froth source after changing only the high-level program:

```sh
froth send
```

That split is the point of project FFI: C is for the narrow binary edge; Froth
is where the program stays live and reshapeable.
