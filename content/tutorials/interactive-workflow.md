---
title: "Interactive Workflow"
weight: 2
description: "Use the prompt or editor as a live loop against the device-owned image."
---

This is not a project tutorial. It is the workflow tutorial.

Frothy work is a loop: send a small change, run it on the target, inspect the
image, and revise the same names. The board is not just where the final
program runs. During live work, the board is the development environment.

## Keep The Change Small

Start with one helper:

```frothy
to dot with x, y [
  grid.clear:;
  grid.set: x, y, true;
  grid.show:
]
```

Run it:

```frothy
dot: 2, 2
```

If the display is connected and initialized, one pixel should light.

## Use A Named Entry Point

Give yourself one command to rerun:

```frothy
demo.run is fn [
  matrix.init:;
  matrix.brightness!: 1;
  dot: 2, 2
]
```

Now the edit loop has a stable handle:

```frothy
demo.run:
```

Change `dot`, then run `demo.run:` again. The entry point resolves the current
value in the `dot` slot, not a stale copy.

That single fact changes the way you should work. Do not write a twenty-line
definition and hope. Write one small word, test it, and compose upward.

```frothy
to line.demo [
  grid.clear:;
  matrix.line: 0, 0, 11, 7, true;
  grid.show:
]
```

Send that. Run it. Then decide whether the next word should draw a box, read a
knob, or change brightness.

## Inspect The Image

Use the same names the editor calls:

```frothy
words
see demo.run
see dot
see matrix.init
```

Inspection is part of normal work. It tells you what the image currently holds.

Use `words` when you forgot a name. Use `see` when the name exists but the
behavior is not what you expected — it renders the source the image currently
holds. Use `status` when you need to know about the session and runtime.

## Interrupt A Bad Loop

If you start a loop that runs too long:

```frothy
repeat 1000000 [
  demo.run:;
  ms: 20
]
```

Press `Ctrl-C` at the prompt or use `Frothy: Interrupt` in the editor. The
runtime checks for interrupts at safe points and returns to a usable prompt.

In VS Code, **Frothy: Interrupt** sends the same kind of interruption through
the connected control session.

## Save The Session

When the current overlay is worth keeping:

```frothy
save
```

Reboot, reconnect, and inspect the names again. The base image is rebuilt at
boot, then the saved overlay is restored on top.

If you save a bad overlay, use `restore` only when the saved image is known
good. Use `dangerous.wipe` when the saved overlay itself is the thing you need
to discard.
