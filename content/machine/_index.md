---
title: "Machine"
weight: 2
description: "Meet the Froth Machine: the display, controls, and game-shaped workflow on the protoboard."
---

The Froth Machine is the workshop board built around an ESP32, a TM1629 12x8
display, a joystick with click, two knobs, an LED, and a handful of raw pins.

The right way to learn it is not by memorizing every low-level word first.
Start with the friendly board layer:

- `matrix.*` for display setup and drawing
- `grid.*` for the smallest workshop-facing drawing helpers
- `joy.*` for the joystick directions and click
- `knob.*` for the two potentiometers
- `demo.pong.*` for a real built-in game-shaped example

If you want one five-line proof that the board is alive, use this:

```froth
matrix.init:
grid.clear:
grid.set: 1, 1, true
grid.show:
joy.click?:
```

That does three useful things at once:

- it initializes the display
- it proves you can light a pixel
- it proves the input helper layer is present

From here, the Machine docs split by the questions most people actually ask:

- [First steps](/machine/first-steps/) for "what is on this board?" and "what
  words do I try first?"
- [Display and drawing](/machine/display-and-drawing/) for pixels, lines,
  rectangles, and the display layers
- [Inputs and controls](/machine/inputs-and-controls/) for joystick, knobs, and
  the raw button path
- [Patterns](/machine/patterns/) for game loops, joystick movement, collision,
  knob mapping, timing, Life, and Pong

Use the [Machine board reference](/reference/hardware/words/) when you want
exact arguments and return values. Use [Workshop](/workshop/) for the live
classroom activity, creative missions, and troubleshooting.
