---
title: "Word Reference"
weight: 1
description: "Core syntax, operators, state, collections, and prompt-facing built-ins."
icon: hash
tags: [syntax, operators, cells, records]
---

This page covers the core language surface. Hardware APIs live under [Hardware](/reference/hardware/). CLI and editor behavior live under [CLI](/reference/cli/) and [Interactive Profile](/reference/interactive-profile/).

## Top-Level Forms

**`name is expr`** *(core)*

Layer: `core`  
Behavior: Creates or rebinds a stable top-level slot. Rebinding changes the
current value stored in that slot without changing the slot's identity.  
Example:

```frothy
counter is 0
counter is counter + 1
```

**`name is fn [ ... ]`, `to name with a, b [ ... ]`** *(core)*

Layer: `core`  
Behavior: Binds a stable top-level slot to a `Code` value. The docs usually
write zero-argument words as `name is fn [ ... ]` and use `to ... with ...`
when the name and arguments read naturally together.  
Example:

```frothy
boot is fn [ led.on: ]

to blink with pin, wait [
  gpio.high: pin;
  ms: wait;
  gpio.low: pin
]
```

## Calls and Operators

**`callee: arg1, arg2`** *(core call syntax)*

Layer: `core`  
Behavior: Calls a `Code` value with ordinary Frothy syntax. Calling any
non-`Code` value is a runtime error.  
Example:

```frothy
blink: $led_builtin, 75
gpio.write: $led_builtin, 1
```

**`call expr with ...`** *(core call syntax)*

Layer: `core`  
Behavior: Calls the result of a computed expression rather than a literal name.
Useful when the callee itself is selected at runtime.  
Example:

```frothy
call pickAction: with
```

**`* / % + - < <= > >= == != and or`** *(core operators)*

Layer: `core`  
Behavior: Left-to-right binary operators with equal precedence. Parentheses are
the only grouping mechanism. Conditions require explicit `Bool` values.  
Example:

```frothy
(adc.percent: $a0) > 50 and enabled
```

## Locals and Mutation

**`here name is expr`, `name is expr` inside a block** *(core)*

Layer: `core`  
Behavior: Creates a lexical local binding in the current block scope. Locals
shadow outer locals and top-level names. Lookup always prefers the nearest
reachable local before falling through to outer scopes and then the top level.  
Example:

```frothy
speed is 75

demo is fn [
  here speed is 10;
  speed
]
```

Worked example:

```frothy
speed is 75

nested is fn [
  here speed is 10;
  when true [
    here speed is 3;
    speed
  ]
]
```

The result is `3`, not `10` and not `75`, because the innermost reachable local
wins.

**`set place to expr`** *(core)*

Layer: `core`  
Behavior: Mutates an existing place. A place is either a name or an indexed
cells element. Record fields are also valid places. Missing places are an
error.  
Example:

```frothy
set counter to counter + 1
set frame[0] to 99
set point->x to 12
```

## Control Flow

**`if`, `when`, `unless`** *(core)*

Layer: `core`  
Behavior: Conditional expressions that require `Bool` conditions. `if` without
`else` yields `nil` when the condition is false.  
Example:

```frothy
when adc.percent: $a0 > 50 [ led.on: ]
```

**`while`, `repeat`, `repeat ... as name`** *(core)*

Layer: `core`  
Behavior: Loops over a condition or a count. `while` yields `nil`, and
`repeat ... as name` exposes the loop index as a local.  
Example:

```frothy
repeat 4 as i [ led.blink: i + 1, 30 ]
```

## Structured Data

**`cells(n)`, `expr[index]`** *(core)*

Layer: `core`  
Behavior: `Cells` is the narrow fixed-size mutable indexed store. Use `cells(n)`
at top level to create a fixed store you can read and update by index.  
Example:

```frothy
buffer is cells(8)
set buffer[0] to 42
```

Worked example:

```frothy
levels is cells(3)
set levels[0] to 20
set levels[1] to 40
set levels[2] to 60

to average3 with values [
  (values[0] + values[1] + values[2]) / 3
]

average3: levels
```

Use this shape when position is the real structure. `values[0]`, `values[1]`,
and `values[2]` are three lanes in a fixed store, not three named fields on
one record.

**`record Name [ field, ... ]`, `Name: ...`** *(core)*

Layer: `core`  
Behavior: Declares a fixed-layout record definition and uses the generated
constructor slot to create shaped values.  
Example:

```frothy
record Point [ x, y ]
origin is Point: 0, 0
```

Worked example:

```frothy
record Sprite [ x, y, visible ]

player is Sprite: 3, 4, true
set player->x to player->x + 1
set player->visible to false

player->x
player->visible
```

Use a record when the value represents one coherent thing with named parts.
That is why `player->x` reads better than `player[0]`.

**`fn [ ... ]`, `fn with ... [ ... ]` non-capturing rule** *(core)*

Layer: `core`  
Behavior: A `Code` value may use its own parameters, locals it binds in its own
body, and top-level names. It may not capture locals from an enclosing block or
function.  
Example:

```frothy
wait is 75

make-blink is fn [
  fn with pin [
    gpio.high: pin;
    ms: wait;
    gpio.low: pin
  ]
]
```

Working shape:

```frothy
step is 1

make-stepper is fn [
  fn with x [ x + step ]
]

stepper is make-stepper:
stepper: 41
```

This works because `step` is top-level.

Rejected shape:

```frothy
make-local-stepper is fn [
  here step is 1;
  fn with x [ x + step ]
]
```

This fails because the returned `Code` would need to capture the local `step`.

Write it one of two ways:

```frothy
step is 1
make-shared-stepper is fn [ fn with x [ x + step ] ]

adder is fn with x, step [ x + step ]
```

`make-shared-stepper` is valid because `step` is top-level. `adder` shows the
other version: if the value is not top-level, pass it as an argument at call
time instead of trying to smuggle it in through closure capture.

## Inspection and Persistence Built-Ins

**`words`, `see name`, `status`** *(interactive base image)*

Layer: `core`  
Behavior: Inspect the live image: `words` lists visible names, `see` renders a
binding's source form, and `status` reports the session and runtime.  
Example:

```frothy
words
see blink
status
```

**`save`, `restore`, `dangerous.wipe`** *(interactive base image)*

Layer: `core`  
Behavior: Persist, rebuild, or clear the overlay image. `dangerous.wipe`
returns the runtime to the base image.  
Example:

```frothy
save
restore
dangerous.wipe
```

Worked example:

```frothy
record Counter [ value ]
counter is Counter: 0

set counter->value to 1
save
set counter->value to 9
restore
counter->value
```

After `restore`, `counter->value` is back to `1`. The overlay state is what
persists, not the last mutation you happened to make after saving.
