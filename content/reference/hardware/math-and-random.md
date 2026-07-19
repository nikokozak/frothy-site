---
title: "Math & Random"
weight: 5
url: /reference/modules/math-and-random/
description: "Transform bounded integers and generate repeatable pseudo-random values with the base-image helpers."
icon: calculator
tags: [math, random, integers]
---

Frothy math is integer math. These words keep common sensor scaling, bounds,
cyclic indexes, and pseudo-random choices readable without introducing a
floating-point value kind.

## Scale A Sensor Reading

```frothy
raw is adc.read: $a0
percent is map: raw, 0, 4095, 0, 100
limited is clamp: percent, 10, 90
```

## Word Table

| Word | Result | Use |
| --- | --- | --- |
| [`abs`](/reference/words/#abs) | `Int` | Absolute value |
| [`min`](/reference/words/#min) | `Int` | Smaller input |
| [`max`](/reference/words/#max) | `Int` | Larger input |
| [`clamp`](/reference/words/#clamp) | `Int` | Limit a value to an inclusive range |
| [`map`](/reference/words/#map) | `Int` | Linearly remap between two ranges |
| [`mod`](/reference/words/#mod) | `Int` | C-style truncating remainder |
| [`sqrt`](/reference/words/#sqrt) | `Int` | Floor square root of a nonnegative integer |
| [`wrap`](/reference/words/#wrap) | `Int` | Cyclic remainder, or `0` for a nonpositive size |
| [`sign`](/reference/words/#sign) | `Int` | Clamp to `-1`, `0`, or `1` |
| [`random.next`](/reference/words/#random-next) | `Int` | Next nonnegative pseudo-random integer |
| [`random.below`](/reference/words/#random-below) | `Int` | Random integer in `[0, limit)` |
| [`random.seed`](/reference/words/#random-seed) | `nil` | Reset the pseudo-random sequence |
| [`random.chance?`](/reference/words/#random-chance) | `Bool` | Numerator-over-denominator chance |
| [`random.percent?`](/reference/words/#random-percent) | `Bool` | Percentage chance |

## Bounds And Mapping

```frothy
min: 4, 9
max: 4, 9
clamp: 120, 0, 100
map: 2048, 0, 4095, 0, 100
```

`clamp` rejects a lower bound greater than its upper bound. `map` uses integer
division, so fractional results truncate toward zero. It permits ascending or
descending ranges, rejects a zero-width input range, and reports a range error
if the final result cannot fit a Frothy integer.

`abs` reports a range error for the one most-negative integer because its
positive counterpart is outside the tagged integer range.

## Remainders, Wrapping, And Roots

```frothy
mod: 37, 10
mod: -3, 10
wrap: 37, 10
sign: -20
sqrt: 80
```

`mod` follows C truncating remainder semantics and rejects a zero divisor.
`wrap` is the small source helper `if size <= 0 [ 0 ] else [ value % size ]`;
it does not normalize every negative remainder into a positive index. `sqrt`
returns the floor root (`8` for `80`) and rejects negative inputs.

## Repeatable Random Sequences

```frothy
random.seed: 12345
first is random.next:
1 + random.below: 6
coin? is random.percent?: 50
```

This is deterministic pseudo-randomness, suitable for variation, simulation,
and repeatable tests—not cryptographic keys or security decisions. The same
seed starts the same sequence on a given implementation.

`random.below` requires a positive limit. Use numerator and denominator values
that describe a meaningful probability:

```frothy
random.chance?: 1, 4
random.percent?: 25
```

`random.chance?` returns false for a nonpositive denominator. Percent callers
normally stay in `0..100`; the helper itself is ordinary Frothy source and does
not clamp the input.
