---
title: "01. First Steps"
weight: 1
description: "What the Froth Machine is, what is on it, and the first words to try."
---

If you have just been handed the Froth Machine in a workshop, start here.

## What Is On The Board

The workshop board gives you:

- a 12x8 LED matrix display
- a five-way joystick: up, down, left, right, and click
- two potentiometers
- a built-in LED
- raw pin names for the display, joystick, knobs, and buttons

In everyday Froth work, the front-door words are not the raw pin names.
Start with the higher-level board words instead.

## The First Display Proof

```froth
matrix.init:
matrix.brightness!: 0
grid.clear:
grid.set: 1, 1, true
grid.show:
```

Read that line by line:

1. `matrix.init:` brings up the display using the board's baked-in wiring
2. `matrix.brightness!:` sets a visible brightness level
3. `grid.clear:` wipes the current framebuffer
4. `grid.set:` lights one pixel
5. `grid.show:` flushes the framebuffer to the display

That is the basic pattern for the whole board:

- initialize
- mutate state
- show the result

## The First Input Proof

Try the joystick and knobs directly at the prompt:

```froth
joy.up?:
joy.down?:
joy.left?:
joy.right?:
joy.click?:
knob.left:
knob.right:
```

What those return:

- each `joy.*?` word returns a boolean
- `knob.left` and `knob.right` return a percentage-style value on the `0..100`
  scale

If you want the raw analog value instead, use:

```froth
knob.left.raw:
knob.right.raw:
```

## The Word Families You Will Use Most

For most workshop-sized experiments, these are the families that matter first:

- `matrix.init`, `matrix.show`, `matrix.clear`, `matrix.fill`
- `matrix.pixel!`, `matrix.line`, `matrix.rect`, `matrix.fillRect`
- `grid.clear`, `grid.set`, `grid.get`, `grid.toggle`, `grid.rect`, `grid.fill`,
  `grid.show`
- `joy.up?`, `joy.down?`, `joy.left?`, `joy.right?`, `joy.click?`
- `knob.left`, `knob.right`, `knob.left.raw`, `knob.right.raw`
- `demo.pong.setup`, `demo.pong.frame`, `demo.pong.run`

That is enough to do a surprising amount of work.

## One Tiny Interactive Sketch

Here is a simple moving cursor driven by the knobs:

```froth
to scaleKnob with percent, max [
  percent * max / 100
]

cursor.frame is fn [
  here x is scaleKnob: knob.left:, (grid.width - 1);
  here y is scaleKnob: knob.right:, (grid.height - 1);
  grid.clear:;
  grid.set: x, y, true;
  grid.show:
]

repeat 60 [
  cursor.frame:;
  ms: 40
]
```

This is a good first board sketch because it makes the board feel live
immediately. Turn the knobs and the lit pixel should move with them.

## What About Buttons?

The board exposes raw button pin names such as `BUTTON_1`, `BUTTON_2`, and
`BUTTON_3`, but the friendly workshop layer is built around the joystick and
knobs first.

If you want to experiment with a raw button, the shape is:

```froth
gpio.input: BUTTON_2
gpio.read: BUTTON_2
```

That gives you the raw pin level. If you want a semantic boolean helper, write
one of your own the same way the joystick helpers do.

One board-specific detail matters here: `BUTTON_1` and `A0` share the same raw
GPIO on the mounted workshop board, so do not treat them as independent inputs.

Next: [Display and drawing](/machine/display-and-drawing/).
