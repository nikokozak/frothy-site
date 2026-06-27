---
title: "07. Errors and Recovery"
description: "Recoverable runtime errors, interrupts, safe boot, inspection, and getting back to a usable prompt."
weight: 7
aliases:
  - /guide/05-inspection-and-live-workflow/
---

A live microcontroller language needs mistakes to be survivable. If a bad
line at the prompt can destroy the session, the prompt stops being a useful
working surface.

Froth treats reader errors, parser errors, type errors, arity errors, bounds
errors, division by zero, and persistence rejection as recoverable whenever
possible. The target should report the error and return to a usable prompt.

## Typical Errors

Calling a non-`Code` value is an error:

```froth
delay is 75
delay:
```

`delay` is an `Int`, not callable code.

Calling code with the wrong number of arguments is also an error:

```froth
to pulse with pin, wait [
  gpio.high: pin;
  ms: wait;
  gpio.low: pin
]

pulse: LED_BUILTIN
```

`pulse` expects two arguments. The prompt should stay alive after reporting
the problem.

Cells bounds and kind errors are another common class:

```froth
scores is cells(2)
set scores[3] to 10
```

The cells object exists, but index `3` is outside a two-element store.

## Interrupts

Use `Ctrl-C` to interrupt long-running evaluation or pending multiline input.
The runtime checks interruption at safe points, including loop back edges.

```froth
while true [
  led.toggle:;
  ms: 100
]
```

If you start a loop like that by accident, interrupt it. After interruption,
the prompt should still be usable.

## Inspect Before You Wipe

When something feels wrong, inspect first:

```froth
words
show @boot
see @boot
info @boot
```

`show` and `see` give you the normalized binding view. `info` tells you
whether a name is user-defined, foreign, base-image, persistable, or otherwise
special. Use those tools before reaching for destructive recovery.

## Recovery Ladder

Use the smallest recovery operation that matches the problem:

```froth
restore
dangerous.wipe
```

`restore` replaces the current live overlay with the saved overlay. Use it
when you have made bad live edits but the stored image is known good.

`dangerous.wipe` clears both the live overlay and the stored overlay. Use it
when the saved image itself is bad, or when you deliberately want the base
image back.

## Safe Boot

If saved `boot` code prevents the prompt from becoming usable, power-cycle or
reset the board and press `Ctrl-C` during the safe-boot window. Then run:

```froth
dangerous.wipe
```

That returns the device to the boot-rebuilt base image. It is intentionally
named `dangerous.wipe` because it removes saved overlay state, not just the
current line of work.

Next: [Text and I/O](/guide/08-strings-and-io/).
