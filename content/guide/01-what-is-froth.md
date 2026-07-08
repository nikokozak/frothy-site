---
title: "01. What Frothy Is"
description: "The core mental model: stable slots, lexical code, and a live image."
weight: 1
icon: lightbulb
readTime: "4 min"
---

Frothy is easiest to learn if you start with three laws from the accepted
language spec:

1. The top level is a board of stable named slots.
2. Code only does a small number of things: read, bind, set, call, choose, and
   repeat.
3. Persistence remembers the overlay image, not the current execution.

That is the center of the language. Frothy is not organized around a
user-visible stack. It is organized around values, places, and a live image
you can inspect and recover.

## A Tiny Example

```frothy
unit is 75

to pulse with pin [
  gpio.high: pin;
  ms: unit;
  gpio.low: pin
]

to blink with pin [
  repeat 3 [
    pulse: pin;
    ms: unit
  ]
]

blink: $led_builtin
```

Read that as ordinary named code:

- `unit` is a top-level slot
- `pulse` and `blink` are top-level `Code` values
- `repeat` is a loop expression
- `gpio.high` and `ms` are base-image board bindings

If you redefine `blink`, old callers see the new definition because they still
resolve through the same stable top-level slot.

## What Makes It Different

Frothy is built around a few current priorities:

- live interaction on the device
- coherent redefinition
- persistence and recovery
- transparent inspection

It deliberately keeps the public model named and lexical. In Frothy, values are
read by name, locals are lexical, and code is just another value.

## The First Things To Keep In Your Head

- `name is expr` creates or rebinds a stable top-level slot.
- `to name [...]` is just sugar for binding a `Code` value.
- `fn [...]` creates anonymous `Code`.
- `save`, `restore`, and `dangerous.wipe` operate on the overlay image.
- The device is the real environment. Host tools help you get there faster.

Next: [Getting started](/guide/02-getting-started/).
