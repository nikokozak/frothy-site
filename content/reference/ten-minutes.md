---
title: "Frothy in ten minutes"
weight: 0
description: "A one-page pass through the Frothy language, from prompt basics to saved hardware code."
---

Run these at a live prompt in order. Each example keeps to the surface that has
been checked on a real DevKit.

## Talk To The Board

Type one line, read the answer, and keep going.

```text
> 42
ok
> -7 + 50
43
ok
> 2 * 3 + 4
10
ok
> (2 + 3) * 4
20
ok
> hashprobe:
error: not found (7)
name: hashprobe
hashprobe:
^^^^^^^^^
>
```

## Truthiness And Booleans

Only `nil`, `false`, and `0` take the false branch.

```text
> if 5 [ 1 ] else [ 2 ]
1
ok
> if nil [ 1 ] else [ 2 ]
2
ok
> if 0 [ 1 ] else [ 2 ]
2
ok
> not nil
true
ok
> 1 < 2 and 3 < 4
true
ok
>
```

## Words

Define words with `to`; call them with a colon.

```text
> to double with n [ n * 2 ]
ok
> double: 21
42
ok
> print: "hello"
hello
ok
> led.on:
ok
> to fib with n [ if n < 2 [ n ] else [ fib: n - 1 + fib: n - 2 ] ]
ok
> fib: 10
55
ok
>
```

A bare word name displays its `code N` value. It does not call the word; the
colon does.

## X-ray A Word

Use `see` to reconstruct source from what is actually installed; it is a REPL
command, so no colon.

```text
> see double
overlay code
to double with n [ n * 2 ]
ok
>
```

## Loops And Locals

Use `here` to declare a local and `set` to mutate it.

```text
> to sum-to with n [ here t is 0; repeat n as i [ set t to t + i ]; t ]
ok
> sum-to: 10
45
ok
> to countdown with n [ here x is n; while x > 0 [ set x to x - 1 ]; x ]
ok
> countdown: 5
0
ok
>
```

`repeat ... as` gives you a zero-based index. Parameters stay immutable; mutate
a local when you need a counter.

## Cells

Use cells for fixed-size mutable indexed storage.

```text
> readings is cells(3)
ok
> set readings[0] to 11
ok
> set readings[1] to 22
ok
> readings[0] + readings[1]
33
ok
>
```

Cell values are saved with your program, so a saved `readings[0]` can survive a
reset.

## Records

Declare the record shape at top level, construct with a colon, and use arrows
for fields.

```text
> record pt [ x, y ]
ok
> p is pt: 3, 4
ok
> p -> x + p -> y
7
ok
> set p -> x to 30
ok
> p -> x
30
ok
>
```

Record construction inside a `to` body is currently unsupported, so construct
records at top level.

## React To The World

Register events inside a definition body with a block.

```text
> to start-ticking [ every 1000 [ print: "tick" ] ]
ok
> start-ticking:
ok
! tick
! tick
```

Bare `every` at the prompt is unsupported; wrap event registration in a
definition.

## Hardware In Five Lines

The same prompt can configure pins, use the LED helpers, blink, and read ADC.

```text
> gpio.output: 2
ok
> led.on:
ok
> led.off:
ok
> blink: 2, 3, 100
ok
> adc.percent: 34
100
ok
>
```

An unconnected pin floats near the top of the 12-bit range, so `adc.read: 34`
gives `4095` and `adc.percent: 34` gives `100`.

## Keep It

Use `save` when your current program should survive reset.

```text
> save
ok
```

Definitions and cell values survive a hard reset. After saving and resetting,
the checked cell example still returned:

```text
> readings[0]
11
ok
>
```

Firmware with a different profile hash rejects old saves cleanly at boot.

## Where Next

- [Install](/install/)
- [Editor](/reference/editor/)
- [Word reference](/reference/words/)
