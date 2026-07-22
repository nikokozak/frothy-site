---
title: "05. Locals, Names, and State"
description: "Lexical locals, explicit mutation, top-level Cells, and small records."
weight: 5
icon: boxes
readTime: "7 min"
---

Frothy keeps data flow explicit, but the public tools are named and lexical:

- parameters for inputs
- locals for intermediate values
- `set` for mutation
- top-level `Cells` and records for persistent state

You should not need a vocabulary of stack shuffles to read ordinary Frothy.

## Locals

A block introduces a lexical scope. Inside that scope, bind a local with
`here`:

```frothy
to scaleKnob with percent, max [
  here bounded is clamp: percent, 0, 100;
  bounded * max / 100
]
```

The last expression in the block is the value the block yields. Here, the
result is the scaled number.

You can also use `name is expr` inside a block, but `here` makes the intent
obvious in teaching examples. It says "this is local to the current block."

## Mutation

Use `set name to expr` when you intend to update an existing place:

```frothy
to countdown with n [
  here current is n;
  while current > 0 [
    set current to current - 1
  ];
  current
]
```

`set` does not create a new name. If Frothy cannot find an existing mutable
place, it is a runtime error. That rule catches a large class of misspellings
that stack languages usually cannot see.

## Top-Level State

Top-level state is useful when the value is part of the live image:

```frothy
player.x is 0
player.y is 0
width is 4
height is 4

to player.move with dx, dy [
  set player.x to wrap: player.x + dx, width;
  set player.y to wrap: player.y + dy, height
]
```

Top-level rebinding is persistent-image state, not a temporary local. Use it
for things you want to inspect, redefine, save, and restore.

## `Cells`

`Cells` is the first fixed-size mutable collection. It is intentionally narrow.
Elements may hold `Nil`, `Bool`, `Int`, `Text`, or record values.

Create cells at top level:

```frothy
scores is cells: 4
set scores[0] to 10
set scores[1] to 25
scores[1]
```

Cells are good for small tables, board-sized state, and simple buffers. They
are not a general heap. In current Frothy, `cells: n` belongs in a top-level
binding so the image can reason about ownership and persistence.

## Records

Records give names to small fixed shapes. Declare the shape and construct
values at the top level:

```frothy
record Point [ x, y ]
position is Point: 3, 9
```

Read and update fields with `->`:

```frothy
position -> x
set position -> y to 12
```

Record shapes and values are persistable, and record values can be stored in
Cells. `Bytes` and live `Handle` values cannot be stored in either. Record
construction currently belongs at the top level; pass constructed records into
words when behavior needs them.

## Prefer Named Data Flow

When a value matters enough to reuse, give it a name or pass it as a parameter:

```frothy
to weighted with value, scale [
  value + (scale * value)
]
```

The current form is longer only when the data flow was unnamed. Once the
values mean something, names win. A reader does not need to simulate the stack
to know what is being reused.

Next: [Blocks and control flow](/guide/06-quotations-and-control/).
