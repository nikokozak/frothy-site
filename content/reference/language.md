---
title: "Language"
weight: 1
description: "Exact syntax and runtime semantics for Frothy values, calls, definitions, control flow, records, errors, events, and comments."
icon: braces
tags: [syntax, semantics, errors, records]
---

Use this page when you need the exact Frothy language rules, not a tutorial.

## Source Shape

Frothy source is a sequence of expressions. A block uses square brackets and
returns the value of its final expression. Semicolons separate multiple
expressions inside a block.

```frothy
to pulse with pin, wait [
  gpio.high: pin;
  ms: wait;
  gpio.low: pin
]
```

Call a word with a colon. A bare name looks up the value; it does not call it.

```frothy
double:
double: 21
```

Use parentheses for grouping.

```frothy
(2 + 3) * 4
```

## Values And Truthiness

The first public values are `Int`, `Bool`, `Nil`, `Text`, `Cells`, `Code`,
records, bytes, and native handles. Feature-gated builds can expose fewer
families, but the ESP32 plain profile exposes the documented surface.

Only `nil`, `false`, and `0` take the false branch. Every other value is
truthy.

```frothy
if 5 [ 1 ] else [ 2 ]
if nil [ 1 ] else [ 2 ]
if 0 [ 1 ] else [ 2 ]
```

Text is immutable and byte-oriented in the current implementation.

```frothy
label is "ready"
text.length: label
```

## Operators

Arithmetic precedence is conventional: `*`, `/`, and `%` bind tighter than
`+` and `-`. Comparisons bind after arithmetic, `and` binds after comparisons,
and `or` binds after `and`. Operators of the same precedence group associate
left to right. Use parentheses when the intended grouping should be visible.

```frothy
2 * 3 + 4
(2 + 3) * 4
1 < 2 and 3 < 4
```

The prefix operator `not` applies to the next unary expression.

```frothy
not nil
```

## Definitions, Parameters, And Locals

Top-level `name is expr` creates or rebinds a stable slot. Rebinding changes
the current value in that slot without changing the slot identity.

```frothy
counter is 0
counter is counter + 1
```

`to` binds a top-level word to `Code`. `fn` creates a `Code` value.

```frothy
to double with n [ n * 2 ]

boot is fn [ led.on: ]
```

Parameters are immutable. If you need a counter or accumulator, declare a local
with `here` and mutate it with `set`.

```frothy
to countdown with n [
  here x is n;
  while x > 0 [ set x to x - 1 ];
  x
]
```

`here name is expr` creates a lexical local in the current block scope. Locals
shadow outer locals and top-level names. Lookup prefers the nearest reachable
local, then outer scopes, then the top level.

```frothy
speed is 75

to demo [
  here speed is 10;
  when true [
    here speed is 3;
    speed
  ]
]
```

`set place to expr` mutates an existing name, cells element, or record field.
It does not create a new place.

```frothy
set counter to counter + 1
set readings[0] to 99
set point -> x to 12
```

`Code` values may use their own parameters, locals they bind in their own
body, and top-level names. They do not capture locals from an enclosing block.

```frothy
step is 1
make-stepper is fn [ fn with x [ x + step ] ]
```

If a value is not top-level, pass it as an argument instead of trying to close
over it.

```frothy
adder is fn with x, step [ x + step ]
```

## Control Flow

`if` is an expression. It accepts an optional `else`, and `else if` chains into
the same expression.

```frothy
if n < 2 [ n ] else [ fib: n - 1 + fib: n - 2 ]
```

`when` is the one-sided form. If the condition is false, it yields `nil`.
`unless` runs its block when the condition is false and also yields `nil`
otherwise.

```frothy
when adc.percent: $a0 > 50 [ led.on: ]
unless ready [ led.off: ]
```

`while` checks the condition before each iteration and yields `nil`.

```frothy
while x > 0 [ set x to x - 1 ]
```

`repeat N [ body ]` runs the body `N` times. `repeat N as i [ body ]` also
binds a zero-based local index for each iteration.

```frothy
repeat 4 as i [ led.blink: i + 1, 30 ]
```

`forever [ body ]` loops until interrupted or until the body errors.

```frothy
forever [ led.toggle:; ms: 100 ]
```

## Cells

`cells(n)` creates fixed-size mutable indexed storage. Use cells when position
is the real structure.

```frothy
readings is cells(3)
set readings[0] to 11
set readings[1] to 22
readings[0] + readings[1]
```

Cell indexes are zero-based. An out-of-bounds read or write is a runtime
error.

## Records

Declare record shapes at top level.

```frothy
record pt [ x, y ]
```

Construct records with the generated constructor word and a colon.

```frothy
p is pt: 3, 4
```

Read and write fields with arrows.

```frothy
p -> x + p -> y
set p -> x to 30
```

Record construction inside a `to` body is currently unsupported, so construct
records at top level and pass them into words that need them.

## Errors And Attempt/Rescue

Errors render as `error: <name> (N)`. Diagnostics may add typed context such
as expected and got values for type errors, `call depth limit reached (24)`,
or cell bounds context with the bad index and the cell length. Source-position
errors print the source line with carets under the offending span. Near-miss
names can add a suggestion line:

```text
help: did you mean "gpio.high"
```

`attempt [ body ] rescue [ fallback ]` is an expression. If `body` finishes,
its value is the value of the whole expression. If `body` raises a catchable
runtime error, Frothy restores the value stack to the point where the attempt
started, runs `fallback`, and yields the fallback value.

```frothy
1 + attempt [ 2 / 0 ] rescue [ 9 ]
```

That expression yields `10`.

Inside a rescue block, `error.code` and `error.name` expose the caught runtime
error. They are only valid inside rescue blocks.

```frothy
attempt [ missing: ] rescue [ error.name ]
```

Interrupts are never catchable. Compile and parse errors happen before
evaluation, so they do not reach `attempt`.

## Events And Cancel

Event registration belongs inside a definition body. Bare event registration at
the prompt is unsupported.

```frothy
to start-ticking [
  every 1000 [ print: "tick" ]
]
```

`every <ms> [ body ]` registers a repeating timer. `after <ms> [ body ]`
registers a one-shot timer. `on <pin> rising|falling|changes [ body ]`
registers a GPIO event, with optional `debounce <ms>` before the body.
`on wifi.disconnected [ body ]` and `on wifi.reconnected [ body ]` register
Wi-Fi events when the network feature is present.

`cancel` uses the same source identity that event registration stores. `cancel
<pin>` cancels the GPIO binding for that pin, regardless of whether it was
registered as `rising`, `falling`, or `changes`. `cancel every <ms>` cancels
only an `every` timer with the same millisecond source. `cancel after <ms>`
cancels only an `after` timer with the same millisecond source. `cancel
wifi.disconnected` and `cancel wifi.reconnected` cancel only that exact Wi-Fi
event kind; Wi-Fi cancels use a fixed source value of `0`. The defining word's
name is not part of the event identity.

## Comments

Use `--` for a line comment.

```frothy
led.on: -- turn the default LED on
```

Use `-* ... *-` for a block comment.

```frothy
-* temporary bench note *-
led.off:
```

Comments are recognized at the start of input, after whitespace, or after
punctuation that can legally precede a comment. A `--` sequence embedded in a
name is not a comment.
