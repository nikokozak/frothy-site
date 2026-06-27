---
title: "How FFI Works"
weight: 1
description: "How C functions become ordinary Froth words."
---

A C binding becomes an ordinary Froth word by providing:

1. a native callback
2. a metadata record with name, parameters, result type, stack effect, and help
3. an entry in a null-terminated project or board binding table

At boot, Froth installs those tables into the same top-level slot space used by
language-defined words. After registration, there is no separate foreign-call
syntax.

## The Core Type

Project code includes the public header:

```c
#include "froth_ffi.h"
```

The metadata record is:

```c
typedef struct {
  const char *name;
  const froth_ffi_param_t *params;
  uint8_t param_count;
  uint8_t arity;
  froth_ffi_value_type_t result_type;
  const char *help;
  uint32_t flags;
  froth_native_fn_t callback;
  const void *context;
  const char *stack_effect;
} froth_ffi_entry_t;
```

The important fields are:

- `name`: the Froth word name
- `params`: typed argument metadata
- `arity`: how many arguments the word accepts
- `result_type`: the single result class, or `FROTH_FFI_VALUE_VOID`
- `callback`: the C function that implements the word
- `stack_effect`: the inspectable effect line shown by tooling

## Value Classes

The public boundary is defined around:

- `FROTH_FFI_VALUE_INT`
- `FROTH_FFI_VALUE_BOOL`
- `FROTH_FFI_VALUE_NIL`
- `FROTH_FFI_VALUE_TEXT`
- `FROTH_FFI_VALUE_CELLS`
- `FROTH_FFI_VALUE_VOID`

Raw pointers are not ordinary Froth values. Native state behind an FFI word is
not saved into the live image.

## A Minimal Binding

```c
#include "froth_ffi.h"

static const froth_ffi_param_t limit_params[] = {
    FROTH_FFI_PARAM_INT("x"),
    FROTH_FFI_PARAM_INT("lo"),
    FROTH_FFI_PARAM_INT("hi"),
};

static froth_error_t limit_word(froth_runtime_t *runtime,
                                const void *context,
                                const froth_value_t *args,
                                size_t arg_count,
                                froth_value_t *out) {
  int32_t x = 0;
  int32_t lo = 0;
  int32_t hi = 0;

  (void)runtime;
  (void)context;
  (void)arg_count;
  FROTH_TRY(froth_ffi_expect_int(args, 0, &x));
  FROTH_TRY(froth_ffi_expect_int(args, 1, &lo));
  FROTH_TRY(froth_ffi_expect_int(args, 2, &hi));

  if (x < lo) x = lo;
  if (x > hi) x = hi;
  return froth_ffi_return_int(x, out);
}
```

From Froth, that word is just another call:

```froth
limit: 42, 0, 10
```

## Registration Tables

Project bindings are exported from a null-terminated table named
`froth_project_bindings`:

```c
const froth_ffi_entry_t froth_project_bindings[] = {
    {
        .name = "limit",
        .params = limit_params,
        .param_count = FROTH_FFI_PARAM_COUNT(limit_params),
        .arity = 3,
        .result_type = FROTH_FFI_VALUE_INT,
        .help = "Clamp a value into an inclusive range.",
        .flags = FROTH_FFI_FLAG_NONE,
        .callback = limit_word,
        .stack_effect = "( x lo hi -- y )",
    },
    {0},
};
```

Boot installs project bindings after board bindings and before restore and
`boot`. That order means a saved overlay can refer to stable board and project
words, while native runtime state itself remains outside the saved image.
