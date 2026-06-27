---
title: "Word Reference"
weight: 1
description: "Core syntax, operators, state, collections, and prompt-facing built-ins."
---

This page covers the core language surface. Board and protoboard APIs live
under [Machine board reference](/reference/hardware/). CLI and editor behavior live under
[CLI](/reference/cli/) and [Interactive Profile](/reference/interactive-profile/).

## Top-Level Forms

**`name is expr`** *(core)*

Layer: `core`  
Behavior: Creates or rebinds a stable top-level slot. Rebinding changes the
current value stored in that slot without changing the slot's identity.  
Example:

```froth
counter is 0
counter is counter + 1
```

**`name is fn [ ... ]`, `to name with a, b [ ... ]`** *(core)*

Layer: `core`  
Behavior: Binds a stable top-level slot to a `Code` value. The docs usually
write zero-argument words as `name is fn [ ... ]` and use `to ... with ...`
when the name and arguments read naturally together.  
Example:

```froth
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
Behavior: Calls a `Code` value with ordinary Froth syntax. Calling any
non-`Code` value is a runtime error.  
Example:

```froth
blink: LED_BUILTIN, 75
gpio.write: LED_BUILTIN, 1
```

**`call expr with ...`** *(core call syntax)*

Layer: `core`  
Behavior: Calls the result of a computed expression rather than a literal name.
Useful when the callee itself is selected at runtime.  
Example:

```froth
call pickAction: with
```

**`* / % + - < <= > >= == != and or`** *(core operators)*

Layer: `core`  
Behavior: Left-to-right binary operators with equal precedence. Parentheses are
the only grouping mechanism. Conditions require explicit `Bool` values.  
Example:

```froth
(adc.percent: A0) > 50 and enabled
```

## Locals and Mutation

**`here name is expr`, `name is expr` inside a block** *(core)*

Layer: `core`  
Behavior: Creates a lexical local binding in the current block scope. Locals
shadow outer locals and top-level names. Lookup always prefers the nearest
reachable local before falling through to outer scopes and then the top level.  
Example:

```froth
speed is 75

demo is fn [
  here speed is 10;
  speed
]
```

Worked example:

```froth
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

```froth
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

```froth
when adc.percent: A0 > 50 [ led.on: ]
```

**`while`, `repeat`, `repeat ... as name`** *(core)*

Layer: `core`  
Behavior: Loops over a condition or a count. `while` yields `nil`, and
`repeat ... as name` exposes the loop index as a local.  
Example:

```froth
repeat 4 as i [ led.blink: i + 1, 30 ]
```

## Structured Data

**`cells(n)`, `expr[index]`** *(core)*

Layer: `core`  
Behavior: `Cells` is the narrow fixed-size mutable indexed store. Use `cells(n)`
at top level to create a fixed store you can read and update by index.  
Example:

```froth
buffer is cells(8)
set buffer[0] to 42
```

Worked example:

```froth
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

```froth
record Point [ x, y ]
origin is Point: 0, 0
```

Worked example:

```froth
record Sprite [ x, y, visible ]

player is Sprite: 3, 4, true
set player->x to player->x + 1
set player->visible to false

player->x
player->visible
```

Use a record when the value represents one coherent thing with named parts.
That is why `player->x` reads better than `player[0]`.

Records may also be stored inside `Cells`:

```froth
pixels is cells(2)
set pixels[0] to Sprite: 1, 2, true
pixels[0]->y
```

**`fn [ ... ]`, `fn with ... [ ... ]` non-capturing rule** *(core)*

Layer: `core`  
Behavior: A `Code` value may use its own parameters, locals it binds in its own
body, and top-level names. It may not capture locals from an enclosing block or
function.  
Example:

```froth
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

```froth
step is 1

make-stepper is fn [
  fn with x [ x + step ]
]

stepper is make-stepper:
stepper: 41
```

This works because `step` is top-level.

Rejected shape:

```froth
make-local-stepper is fn [
  here step is 1;
  fn with x [ x + step ]
]
```

This fails because the returned `Code` would need to capture the local `step`.

Rewrite it one of two ways:

```froth
step is 1
make-shared-stepper is fn [ fn with x [ x + step ] ]

adder is fn with x, step [ x + step ]
```

`make-shared-stepper` is valid because `step` is top-level. `adder` shows the
other rewrite: if the value is not top-level, pass it as an argument at call
time instead of trying to smuggle it in through closure capture.

## Inspection and Persistence Built-Ins

**`words`, `show @name`, `see @name`, `core @name`, `info @name`** *(interactive base image)*

Layer: `core`  
Behavior: Inspect the live image: visible names, normalized binding view, core
debug view, and binding metadata.  
Example:

```froth
words
info @blink
see @blink
```

**`save`, `restore`, `dangerous.wipe`** *(interactive base image)*

Layer: `core`  
Behavior: Persist, rebuild, or clear the overlay image. `dangerous.wipe`
returns the runtime to the base image.  
Example:

```froth
save
restore
dangerous.wipe
```

Worked example:

```froth
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
