---
title: "04. Patterns"
weight: 4
description: "Practical recipes for loops, movement, collision, timing, animation, Pong, and Life."
---

This page is for the question "how do I build the usual game thing?" rather
than "what does this word take?" For exact arity, use the
[Machine board reference](/reference/hardware/words/).

## The Standard Game Loop

Small Froth Machine games usually settle into the same rhythm:

1. `setup` initializes the display and starting state
2. `update` reads input and advances the model
3. `draw` turns the current state into pixels
4. `frame` does one update-draw-show-sleep cycle
5. `run` repeats frames until you stop

```froth
player.x is 5
player.y is 3
frame.ms is 60

game.setup is fn [
  matrix.init:;
  matrix.brightness!: 0;
  set player.x to 5;
  set player.y to 3
]

game.update is fn [
  when joy.left?:  [ set player.x to player.x - 1 ];
  when joy.right?: [ set player.x to player.x + 1 ];
  when joy.up?:    [ set player.y to player.y - 1 ];
  when joy.down?:  [ set player.y to player.y + 1 ]
]

game.draw is fn [
  grid.clear:;
  grid.set: player.x, player.y, true;
  grid.show:
]

game.frame is fn [
  game.update:;
  game.draw:;
  ms: frame.ms
]

game.run is fn [
  while joy.click?: == false [
    game.frame:
  ]
]
```

For a real game, the next things you usually add are bounds, collision,
scoring, mode state, and an exit condition such as `joy.click?:`.

## Joystick Movement

The joystick words return booleans, so movement is usually a set of small
conditional updates.

```froth
to movePlayer [
  when joy.left?:  [ set player.x to player.x - 1 ];
  when joy.right?: [ set player.x to player.x + 1 ];
  when joy.up?:    [ set player.y to player.y - 1 ];
  when joy.down?:  [ set player.y to player.y + 1 ]
]
```

## Stay On Screen

Clamp coordinates when the player should stop at the edge:

```froth
to clampPlayer [
  set player.x to clamp: player.x, 0, (grid.width - 1);
  set player.y to clamp: player.y, 0, (grid.height - 1)
]
```

Wrap coordinates when leaving one side should re-enter from the other:

```froth
to wrapPlayer [
  set player.x to wrap: player.x, grid.width;
  set player.y to wrap: player.y, grid.height
]
```

## Map A Knob To A Position

The friendly knob words return `0..100`. Scale that to the range you need.

```froth
to scaleKnob with percent, max [
  percent * max / 100
]

to readKnobPosition [
  set player.x to scaleKnob: knob.left:, (grid.width - 1);
  set player.y to scaleKnob: knob.right:, (grid.height - 1)
]
```

## Point Collision

Use point collision for a target pixel, pickup, or single-cell obstacle.

```froth
to hitPoint? with ax, ay, bx, by [
  ax == bx and ay == by
]

when hitPoint?: player.x, player.y, target.x, target.y [
  set score to score + 1
]
```

## Rectangle Collision

Use rectangle collision for paddles, walls, zones, and larger sprites.

```froth
to insideRect? with px, py, rx, ry, rw, rh [
  px >= rx and px < (rx + rw) and py >= ry and py < (ry + rh)
]

when insideRect?: player.x, player.y, wall.x, wall.y, wall.w, wall.h [
  set game.over to true
]
```

## Random Targets

Pick a new target with `random.below:` and the grid dimensions.

```froth
to placeTarget [
  set target.x to random.below: grid.width;
  set target.y to random.below: grid.height
]
```

## Frame Timing

Use one top-level value for the frame delay so the whole game can speed up or
slow down in one place.

```froth
frame.ms is 80

game.frame is fn [
  game.update:;
  game.draw:;
  ms: frame.ms
]
```

You can map a knob to timing too:

```froth
set frame.ms to 20 + knob.left:
```

## Staged Animation

For most sketches, `grid.clear:`, draw, then `grid.show:` is enough. Reach for
the `tm1629.next*` words when you want to build the whole next frame before it
becomes visible.

```froth
tm1629.nextClear:
tm1629.nextPixel!: 2, 3, true
tm1629.nextPixel!: 3, 3, true
tm1629.commitNext:
grid.show:
```

## Built-In Pong

The board ships with a Pong-shaped demo in the base library.

```froth
demo.pong.setup:
demo.pong.run:
```

What it does:

- the left knob controls the left paddle
- the right knob controls the right paddle
- the ball advances one frame at a time
- `joy.click?` exits the run loop

Inspect the shape:

```froth
show @demo.pong.setup
show @demo.pong.update
show @demo.pong.draw
show @demo.pong.frame
show @demo.pong.run
```

The Pong demo is worth studying because it uses the same `setup`, `update`,
`draw`, `frame`, and `run` structure.

## Game Of Life

The board also has a built-in display helper for Conway's Game of Life:
`tm1629.lifeStep`.

Seed a glider like this:

```froth
matrix.init:
grid.clear:
grid.set: 2, 1, true
grid.set: 3, 2, true
grid.set: 1, 3, true
grid.set: 2, 3, true
grid.set: 3, 3, true
grid.show:
```

Then step it:

```froth
repeat 24 [
  tm1629.lifeStep:;
  grid.show:;
  ms: 120
]
```

That example shows why the advanced `tm1629.*` layer exists: sometimes the
display operation is more than drawing one shape.
