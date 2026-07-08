---
title: "Build a Calculator"
weight: 6
description: "Build a small local calculator with named operations, memory, and recoverable state."
---

This tutorial does not need hardware. Use a local target or a connected board.
The point is to practice the current Frothy style without a display or sensor
in the way.

Frothy uses names and values instead of a calculator-style stack. That changes
the shape of the program, but not the exercise: build small operations, test
each one, then compose them.

## State

Create two top-level values:

```frothy
calc.current is 0
calc.memory is 0
```

These are part of the live overlay. You can inspect them:

```frothy
see calc.current
see calc.memory
```

## Basic Operations

Define operations that update `calc.current`:

```frothy
to calc.enter with n [
  set calc.current to n
]

to calc.add with n [
  set calc.current to calc.current + n
]

to calc.sub with n [
  set calc.current to calc.current - n
]

to calc.mul with n [
  set calc.current to calc.current * n
]
```

Try them:

```frothy
calc.enter: 10
calc.add: 5
calc.mul: 3
calc.current
```

The result is `45`.

## Safe Division

Division by zero should report an error and return to the prompt. For a small
calculator, make the guard explicit:

```frothy
to calc.div with n [
  if n == 0 [
    "division by zero"
  ] else [
    set calc.current to calc.current / n;
    calc.current
  ]
]
```

Now both paths are visible:

```frothy
calc.enter: 10
calc.div: 2
calc.div: 0
```

The zero case does not corrupt `calc.current`.

## Memory

Add the classic memory buttons:

```frothy
to calc.store [
  set calc.memory to calc.current
]

to calc.recall [
  set calc.current to calc.memory;
  calc.current
]

to calc.clear [
  set calc.current to 0;
  set calc.memory to 0
]
```

Try a short session:

```frothy
calc.enter: 21
calc.mul: 2
calc.store:
calc.clear:
calc.recall:
```

The recalled value is `42`.

## Computed Operation

Because `Code` is a value, you can pass operations around:

```frothy
to calc.apply with op, n [
  op: n;
  calc.current
]

calc.apply: calc.add, 8
calc.apply: calc.mul, 4
```

This is the current-Frothy analogue of building a small RPN calculator. The
program still composes tiny operations, but the data flow is named instead of
implicit on a stack.

## Save A Good Version

When the calculator has the behavior you want:

```frothy
save
```

You can now experiment with new operations and return to the saved overlay
with `restore`.
