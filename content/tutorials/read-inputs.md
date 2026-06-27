---
title: "Read Inputs"
weight: 5
description: "Read joystick and knob inputs on the Froth Machine, then map them to display state."
---

This tutorial uses the Froth Machine input layer: joystick booleans and knob
percent values.

## Read The Inputs Directly

At the prompt:

```froth
joy.up?:
joy.down?:
joy.left?:
joy.right?:
joy.click?:
knob.left:
knob.right:
```

Each `joy.*?` word returns a boolean. The knob helpers return a value on the
`0..100` scale.

## Map A Knob To A Pixel

Define one scaling helper:

```froth
to scale with percent, max [
  percent * max / 100
]
```

Use the left knob as an x coordinate:

```froth
input.frame is fn [
  here x is scale: (knob.left:), (grid.width - 1);
  grid.clear:;
  grid.set: x, 3, true;
  grid.show:
]
```

Run a short loop:

```froth
repeat 100 [
  input.frame:;
  ms: 30
]
```

Turn the knob while the loop runs. The pixel should move across the display.

## Add Joystick Movement

Store a cursor position:

```froth
cursor.x is 5
cursor.y is 3
```

Update it from the joystick:

```froth
cursor.step is fn [
  when joy.left?: [ set cursor.x to wrap: cursor.x - 1, grid.width ];
  when joy.right?: [ set cursor.x to wrap: cursor.x + 1, grid.width ];
  when joy.up?: [ set cursor.y to wrap: cursor.y - 1, grid.height ];
  when joy.down?: [ set cursor.y to wrap: cursor.y + 1, grid.height ]
]
```

Draw it:

```froth
cursor.frame is fn [
  cursor.step:;
  grid.clear:;
  grid.set: cursor.x, cursor.y, true;
  grid.show:
]
```

Run:

```froth
repeat 200 [
  cursor.frame:;
  ms: 35
]
```

That is the basic input pattern for small sketches: read a boolean or percent,
update a few top-level values, draw the current state.
