---
title: "Board FFI Example"
weight: 3
description: "How maintained board bindings become Froth words and wrappers."
---

Board FFI belongs to the board package. It is how a maintained target exposes
hardware words that every project on that board can rely on.

The pattern is:

1. board-owned C code publishes narrow hardware primitives
2. board library code builds small Froth wrappers
3. user projects compose against the wrapper surface

## Raw Hardware Word

A GPIO output binding has one job: validate arguments, call the board SDK, and
return `nil`.

```c
static const froth_ffi_param_t gpio_write_params[] = {
    FROTH_FFI_PARAM_INT("pin"),
    FROTH_FFI_PARAM_INT("level"),
};

static froth_error_t board_gpio_write(froth_runtime_t *runtime,
                                      const void *context,
                                      const froth_value_t *args,
                                      size_t arg_count,
                                      froth_value_t *out) {
  int32_t pin = 0;
  int32_t level = 0;

  (void)runtime;
  (void)context;
  (void)arg_count;
  FROTH_TRY(froth_ffi_expect_int(args, 0, &pin));
  FROTH_TRY(froth_ffi_expect_int(args, 1, &level));

  board_set_pin_level(pin, level != 0);
  return froth_ffi_return_nil(out);
}
```

The exposed Froth word stays small:

```froth
gpio.write: LED_BUILTIN, 1
```

## Wrapper Layer

Board library code can then create a cleaner board-owned surface:

```froth
to led.on
  gpio.write: LED_BUILTIN, 1
end

to led.off
  gpio.write: LED_BUILTIN, 0
end
```

User code should usually depend on the wrapper when it is clearer:

```froth
to blink with ms
  led.on
  wait: ms
  led.off
  wait: ms
end
```

## What Belongs In Board FFI

Good board FFI words are:

- target-owned
- small
- stable across projects for that board
- honest about their typed argument and result surface

Application policy, protocol parsing, game rules, and one-off helpers belong in
project code instead.
