---
title: "Advent of Code: Safe Dial"
weight: 10
description: "Solve a small rotation puzzle with current Frothy names, Cells, and explicit state."
advanced: true
---

This tutorial uses a local target. It is algorithm practice, not a hardware
demo.

This version keeps the puzzle shape but uses top-level `Cells`, named helpers,
and explicit state.

The input is a sequence of signed rotations. Left turns are negative. Right
turns are positive.

## Input

For a small example, store rotations in cells:

```frothy
dial.turns is cells(6)
set dial.turns[0] to -50
set dial.turns[1] to 1
set dial.turns[2] to -1
set dial.turns[3] to 14
set dial.turns[4] to -20
set dial.turns[5] to 6

dial.count is 6
```

The dial starts at `50`. Count how many turns land exactly on `0`.

## Wrap The Dial

```frothy
to dial.wrap with n [
  wrap: n, 100
]
```

Check it:

```frothy
dial.wrap: -1
dial.wrap: 100
dial.wrap: 137
```

The answers are `99`, `0`, and `37`.

## State

```frothy
dial.position is 50
dial.hits is 0
dial.index is 0
```

One step applies the current turn:

```frothy
to dial.step [
  here turn is dial.turns[dial.index];
  set dial.position to dial.wrap: dial.position + turn;
  when dial.position == 0 [
    set dial.hits to dial.hits + 1
  ];
  set dial.index to dial.index + 1
]
```

## Solve

```frothy
to dial.solve [
  set dial.position to 50;
  set dial.hits to 0;
  set dial.index to 0;
  while dial.index < dial.count [
    dial.step:
  ];
  dial.hits
]
```

Run it:

```frothy
dial.solve:
```

For the sample above, the answer is `2`: `-50` lands on `0`, `+1` moves to
`1`, and `-1` lands on `0` again.

## Why This Shape Works

The state is visible. You can inspect or adjust it while developing:

```frothy
see dial.position
see dial.hits
see dial.turns
```

For puzzle-sized code, current Frothy works best when each helper has one job:
wrap a number, apply one turn, scan the input. You do not need a clever stack
program. You need names that make the state hard to lose.
