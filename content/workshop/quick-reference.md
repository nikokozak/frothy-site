---
title: "Quick Reference"
weight: 3
description: "The workshop cheat sheet for display, input, inspection, control flow, and recovery."
---

## Display

```text
matrix.init:                    Initialize the display
matrix.brightness!: level       Brightness (0-7)
grid.clear:                     Clear all pixels
grid.set: x, y, true            Light a pixel (0,0 = top-left)
grid.rect: x, y, w, h, true     Draw a rectangle outline
matrix.fillRect: x,y,w,h,true   Draw a filled rectangle
grid.fill: true                 Fill all pixels
grid.fill: false                Clear all pixels
grid.show:                      Push to display

grid.width  -> 12               grid.height -> 8
```

## Input

```text
joy.up?:     joy.down?:         Joystick -> true/false
joy.left?:   joy.right?:
joy.click?:                     Joystick button
knob.left:                      Left knob -> 0-100
knob.right:                     Right knob -> 0-100
```

## Inspect

```text
words                           List all names
show @name                      See a definition
info @name                      See metadata
```

## Define And Change

```text
name is value                   Create a named value
set name to value               Change a value
to name [ ... ]                 Define/redefine a function
to name with a, b [ ... ]       Function with parameters
here x is 5                     Local variable
```

## Control Flow

```text
if expr [ ... ] else [ ... ]    Conditional
when expr [ ... ]               One-branch conditional
while expr [ ... ]              Loop
repeat n [ ... ]                Fixed-count loop
repeat n as i [ ... ]           With counter
```

## Save And Recover

```text
save                            Snapshot to storage
restore                         Reload from snapshot
dangerous.wipe                  Factory reset
Ctrl-C during boot              Safe boot
```

## Extras

```text
ms: 100                         Wait 100 milliseconds
millis:                         Current uptime in ms
random.below: n                 Random 0 to n-1
clamp: val, lo, hi              Clamp to range
wrap: val, size                 Wrap around
```

## Call Syntax

```text
word:                           No arguments
word: a, b                      With arguments
(word: a, b)                    Nested call
```

For exact arity and examples, see the
[Machine board reference](/reference/hardware/words/).
