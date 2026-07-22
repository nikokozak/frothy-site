---
title: "07. Errors and Recovery"
description: "Recoverable runtime errors, interrupts, safe boot, inspection, and getting back to a usable prompt."
weight: 7
aliases:
  - /guide/05-inspection-and-live-workflow/
icon: rotate-cw
readTime: "9 min"
---

A live microcontroller language needs mistakes to be survivable. If a bad
line at the prompt can destroy the session, the prompt stops being a useful
working surface.

Frothy treats reader errors, parser errors, type errors, arity errors, bounds
errors, division by zero, and persistence rejection as recoverable whenever
possible. The target should report the error and return to a usable prompt.

## What an Error Looks Like

An error does more than say "no". It names the problem, gives it a code, and,
when a value was rejected, puts that value in the headline. Reader and parser
errors instead point a caret at the exact token in your line. Mistype a word
and the prompt shows you where:

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
any of these, the prompt is still yours. An error never saves automatically;
effects completed earlier in a multi-expression form may still be live.

## Rejected Values

Type, domain, and range errors show the value that caused the rejection:

```text
> "string" + 5
error: wrong type: "string" (2)
expected an int, got text
>
```

```text
> 2 / 0
error: bad value: 0 (3)
>
```

```text
> set scores[9] to 10
error: out of range: 9 (1)
cell index 9 is past the end (length 2)
>
```

Native words use the same mechanism and can add the rejected argument:

```text
> gpio.mode: $led_builtin, 3
error: bad value: 3 (3)
detail: gpio.mode argument 2 was rejected
>
```

Text is quoted and escaped so one value cannot forge extra transcript lines;
text that cannot fit falls back to `text length`. Bytes, cells, records, record
shapes, and handles are always summarized by kind plus size or name. Secret
arguments are shown as `<redacted>`.

See [Error and notice codes](/errors/) for every numeric code and its usual
recovery.

## Notices Are Not Errors

A notice says that a requested side effect did not happen, but evaluation can
continue. The current example is `save` when the overlay contains a live
handle or buffer:

```text
> save
notice: not saved (13)
detail: cannot save slot 'appuart' - bound to a live handle or buffer
ok
>
```

The `ok` means the form completed and the prompt or source batch may continue.
It does not mean a new durable image was written. The live overlay remains
usable, and the previous saved image remains the one restored after reboot.

The notice presentation applies only when the complete prompt form is bare
`save` or `save:`. If `save:` is part of a word or larger expression, the same
code 13 is an error instead. That lets the caller handle it with
`attempt`/`rescue` and prevents later work in that form from silently
continuing.

## Catch Runtime Errors

Use `attempt` and `rescue` when the program has a meaningful fallback:

```frothy
to safe-divide with numerator, denominator [
  attempt [ numerator / denominator ] rescue [
    print: error.name
    0
  ]
]
```

If the attempt succeeds, the expression yields its value. If it raises a
catchable runtime error, Frothy restores the value stack to the start of the
attempt, runs the rescue block, and yields the rescue value.

Inside `rescue`, `error.name` and `error.code` describe the caught error. Errors
raised by called words can be caught by their caller. Reader, parser, and
compile errors happen before execution and cannot be caught; deliberate Ctrl-C
interruption is also never catchable.

## Typical Errors

Calling a non-`Code` value is an error:

```frothy
delay is 75
delay:
```

`delay` is an `Int`, not callable code.

Calling code with the wrong number of arguments is also an error:

```frothy
to pulse with pin, delay [
  gpio.high: pin;
  wait: delay;
  gpio.low: pin
]

pulse: $led_builtin
```

`pulse` expects two arguments. The prompt should stay alive after reporting
the problem.

Cells bounds and kind errors are another common class:

```frothy
scores is cells: 2
set scores[3] to 10
```

The cells object exists, but index `3` is outside a two-element store. The
error headline reports `3`, and the following detail reports the length.

## Interrupts

Use `Ctrl-C` to interrupt long-running evaluation or pending multiline input.
The runtime checks interruption at safe points, including loop back edges.

```frothy
while true [
  led.toggle:;
  wait: 100
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
