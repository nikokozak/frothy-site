---
title: "03. Inputs and Controls"
weight: 3
description: "Joystick, knobs, raw buttons, and the usual way input enters a board sketch."
---

The Froth Machine gives you two friendly input families first:

- `joy.*?` for the joystick
- `knob.*` for the two potentiometers

That is enough for menus, drawing toys, cursor control, and small games.

## The Joystick

The joystick words are:

```froth
joy.up?:
joy.down?:
joy.left?:
joy.right?:
joy.click?:
```

Each one returns a boolean.

That means the usual shape is:

```froth
when joy.left?:  [ ... ]
when joy.right?: [ ... ]
when joy.click?: [ ... ]
```

For first-time work, treat the joystick as "five little buttons with names".

## The Knobs

The knob words are:

```froth
knob.left:
knob.right:
knob.left.raw:
knob.right.raw:
```

The usual front-door words are `knob.left` and `knob.right`. They give you a
percentage-style reading that is easy to map onto board coordinates or speeds.

The `*.raw` variants are there when you want the ADC reading directly.

## Mapping A Knob Onto The Screen

Here is a simple board control loop driven by the knobs:

```froth
to scaleKnob with percent, max [
  percent * max / 100
]

dot.frame is fn [
  here x is scaleKnob: knob.left:, (grid.width - 1);
  here y is scaleKnob: knob.right:, (grid.height - 1);
  grid.clear:;
  grid.set: x, y, true;
  grid.show:
]

repeat 80 [
  dot.frame:;
  ms: 30
]
```

This is a nice early exercise because it teaches the whole control shape:

- read input
- turn it into game or drawing state
- draw the current state
- show the result

## Raw Buttons

The board also exposes raw button pin names such as `BUTTON_1`, `BUTTON_2`, and
`BUTTON_3`.

There is not a dedicated `button.*` helper family yet, so the raw shape is:

```froth
gpio.input: BUTTON_2
gpio.read: BUTTON_2
```

If you want a boolean helper, write one exactly the way the joystick helpers
work:

```froth
button.two? is fn [
  gpio.input: BUTTON_2;
  (gpio.read: BUTTON_2) == 0
]
```

That is the right move when you discover you are asking the same raw GPIO
question over and over.

## One Important Board Quirk

`BUTTON_1` and `A0` share the same raw GPIO on the mounted workshop board.

That means:

- `A0` is not a separate dedicated workshop button input
- if you want clean first-time input work, prefer `joy.*?` and `knob.*`
- use the raw button path only when you really mean to work at that level

## What Input Usually Feeds

On this board, input most often feeds one of three things:

- position: a cursor, paddle, or sprite
- mode: pause, resume, clear, reset
- timing: speed, delay, difficulty

That is why the input layer is small but effective. The board is tiny, so
clear named inputs matter more than a huge helper stack.

Next: [Patterns](/machine/patterns/).
