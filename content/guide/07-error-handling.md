---
title: "07. Errors and Recovery"
description: "Recoverable runtime errors, interrupts, safe boot, inspection, and getting back to a usable prompt."
weight: 7
aliases:
  - /guide/05-inspection-and-live-workflow/
icon: rotate-cw
readTime: "6 min"
---

A live microcontroller language needs mistakes to be survivable. If a bad
line at the prompt can destroy the session, the prompt stops being a useful
working surface.

Frothy treats reader errors, parser errors, type errors, arity errors, bounds
errors, division by zero, and persistence rejection as recoverable whenever
possible. The target should report the error and return to a usable prompt.

## What an Error Looks Like

An error does more than say "no". It names the problem, gives it a code, and
points a caret at the exact token in your line. Mistype a word and the prompt
shows you where:

```text
> gpio.hihg: 5
error: not found (7)
name: gpio.hihg
gpio.hihg: 5
^^^^^^^^^
>
```

Malformed source is reported the same way, with the caret on the token that
broke the parse:

```text
> to [ ]
error: bad source (8)
unexpected token
to [ ]
   ^
>
```

The caret is under the offending span, the `name:` line names the value the
reader could not resolve, and the parenthesized number is the error code. After
any of these, the prompt is still yours — nothing about the reported line
changed your saved image or your live overlay.

## Typical Errors

Calling a non-`Code` value is an error:

```frothy
delay is 75
delay:
```

`delay` is an `Int`, not callable code.

Calling code with the wrong number of arguments is also an error:

```frothy
to pulse with pin, wait [
  gpio.high: pin;
  ms: wait;
  gpio.low: pin
]

pulse: $led_builtin
```

`pulse` expects two arguments. The prompt should stay alive after reporting
the problem.

Cells bounds and kind errors are another common class:

```frothy
scores is cells(2)
set scores[3] to 10
```

The cells object exists, but index `3` is outside a two-element store.

## Interrupts

Use `Ctrl-C` to interrupt long-running evaluation or pending multiline input.
The runtime checks interruption at safe points, including loop back edges.

```frothy
while true [
  led.toggle:;
  ms: 100
]
```

If you start a loop like that by accident, interrupt it. After interruption,
the prompt should still be usable.

## Inspect Before You Wipe

When something feels wrong, inspect first:

```frothy
words
see boot
status
```

`words` lists the names that exist, `see` renders one binding's source form,
and `status` reports the session and runtime. Use those to understand the live
image before reaching for destructive recovery.

## Recovery Ladder

Use the smallest recovery operation that matches the problem:

```frothy
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

```frothy
dangerous.wipe
```

That returns the device to the boot-rebuilt base image. It is intentionally
named `dangerous.wipe` because it removes saved overlay state, not just the
current line of work.

Next: [Text and I/O](/guide/08-strings-and-io/).
