---
title: "Advent of Code: Grid Scan"
weight: 11
description: "Scan a tiny grid with flattened Cells, explicit bounds checks, and neighbor-count helpers."
advanced: true
---

This is the companion to the safe-dial tutorial. It uses local state and a
small flattened grid to show how Froth handles nested loops without hiding the
work.

The grid stores `1` for a marked cell and `0` for empty.

## Input

Use a 4 by 4 sample:

```froth
grid.w is 4
grid.h is 4
scan.grid is cells(16)

set scan.grid[0] to 0
set scan.grid[1] to 1
set scan.grid[2] to 0
set scan.grid[3] to 0

set scan.grid[4] to 1
set scan.grid[5] to 1
set scan.grid[6] to 0
set scan.grid[7] to 0

set scan.grid[8] to 0
set scan.grid[9] to 0
set scan.grid[10] to 0
set scan.grid[11] to 0

set scan.grid[12] to 0
set scan.grid[13] to 0
set scan.grid[14] to 0
set scan.grid[15] to 1
```

## Addressing

Flatten `(x, y)` to an index:

```froth
to scan.index with x, y [
  y * grid.w + x
]
```

Bounds are explicit:

```froth
to scan.inBounds? with x, y [
  (x >= 0) and (x < grid.w) and (y >= 0) and (y < grid.h)
]
```

Read a cell safely:

```froth
to scan.at with x, y [
  if scan.inBounds?: x, y [
    here i is scan.index: x, y;
    scan.grid[i]
  ] else [
    0
  ]
]
```

## Neighbor Count

There are eight neighbors. Write the eight checks. It is clearer than hiding
the fixed shape behind a generic iterator:

```froth
to scan.neighbors with x, y [
  (scan.at: x - 1, y - 1) +
  (scan.at: x, y - 1) +
  (scan.at: x + 1, y - 1) +
  (scan.at: x - 1, y) +
  (scan.at: x + 1, y) +
  (scan.at: x - 1, y + 1) +
  (scan.at: x, y + 1) +
  (scan.at: x + 1, y + 1)
]
```

Count marked cells with fewer than four marked neighbors:

```froth
to scan.accessible? with x, y [
  ((scan.at: x, y) == 1) and ((scan.neighbors: x, y) < 4)
]
```

## Scan The Grid

```froth
scan.total is 0

to scan.solve [
  set scan.total to 0;
  repeat grid.h as y [
    repeat grid.w as x [
      when scan.accessible?: x, y [
        set scan.total to scan.total + 1
      ]
    ]
  ];
  scan.total
]
```

Run it:

```froth
scan.solve:
```

The lesson is the same as the old grid tutorial, but the mechanics are current:
use `Cells` for compact indexed state, use names for the moving parts, and make
bounds checks ordinary helpers instead of stack gymnastics.
