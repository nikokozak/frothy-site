---
title: "02. Display and Drawing"
weight: 2
description: "How the display layers fit together, how to draw, and when to reach for `grid`, `matrix`, or `tm1629`."
---

The display has three useful layers. They are not three unrelated APIs: they
are three levels over the same 12x8 display.

## Which Layer Should I Use?

Use `grid.*` when you are thinking in game cells:

- `grid.clear`
- `grid.set`
- `grid.get`
- `grid.toggle`
- `grid.rect`
- `grid.fill`
- `grid.show`

Use `matrix.*` when you are thinking in display setup or drawing primitives:

- `matrix.init`
- `matrix.brightness!`
- `matrix.pixel!`
- `matrix.line`
- `matrix.rect`
- `matrix.fillRect`
- `matrix.show`

Use `tm1629.*` when you want the more advanced display helpers such as staged
next-frame updates, procedural filling, sprite blits, or the built-in Life
stepper.

For first experiments, initialize with `matrix.init:`, draw with `grid.*` or
`matrix.*`, and flush with `grid.show:` or `matrix.show:`. The front-door
display words share the same framebuffer, so it is normal to mix `grid.set:`
and `matrix.line:` in one frame.

## Why The Split Exists

The split keeps beginner code readable without hiding the lower layers:

- `grid.*` names the board as a tiny game canvas. It is good for pixels,
  toggles, simple collision checks, and workshop sketches.
- `matrix.*` names the board as an LED matrix. It is good for initialization,
  brightness, and geometric drawing.
- `tm1629.*` names the display driver/runtime. It is good when you need staged
  frames, row operations, shifting, procedural fill, blits, or simulation
  helpers.

If you only remember one rule, use `grid.*` for game state and single pixels,
`matrix.*` for display setup and shapes, and `tm1629.*` only when the display
logic itself becomes interesting.

## Light Pixels And Draw A Line

```frothy
matrix.init:
grid.clear:
grid.set: 0, 0, true
grid.set: 11, 7, true
matrix.line: 0, 0, 11, 7, true
grid.show:
```

That shows the usual drawing pattern:

- draw into the framebuffer first
- then show the framebuffer

If you forget the final `show`, the display does not change yet.

## Draw Rectangles

```frothy
matrix.init:
grid.clear:
matrix.rect: 0, 0, 12, 8, true
matrix.fillRect: 2, 2, 3, 2, true
grid.show:
```

This is enough for borders, paddles, simple HUD blocks, and board-sized
sprites.

## Fill The Screen Procedurally

When you want to compute each pixel rather than set them one by one, use
`tm1629.populate`:

```frothy
matrix.init:
tm1629.populate: fn with x, y [ ((x + y) % 2) == 1 ]
grid.show:
```

The painter function receives `x` and `y` and returns a boolean for that pixel.

That is a useful shape for:

- checkerboards
- procedural patterns
- simple terrain
- debugging coordinate logic

## Sprite-Like Thinking

Once you start thinking in rows or reusable shapes, the advanced `tm1629.*`
layer becomes useful. The two most important ideas are:

- the current framebuffer
- the next framebuffer

The next-frame helpers are for animation that should update in one visible step
instead of drawing live into the current buffer pixel by pixel.

The pattern looks like this:

```frothy
tm1629.nextClear:
tm1629.nextPixel!: 2, 3, true
tm1629.nextPixel!: 3, 3, true
tm1629.commitNext:
grid.show:
```

You do not need this layer for every sketch. Reach for it when you want more
control over animation or whole-frame updates.

## A Useful Mental Model

If your idea sounds like:

- "light this pixel"
- "read this pixel"
- "toggle this cell"

use `grid.*`.

If your idea sounds like:

- "draw this line"
- "draw this box"

use `matrix.*`.

If your idea sounds like:

- "build the next frame"
- "fill the display from a rule"
- "step a simulation"

start looking at `tm1629.*`.

Next: [Inputs and controls](/machine/inputs-and-controls/).
