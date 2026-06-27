---
title: "Utilities"
weight: 4
description: "Timing, random, and math helpers commonly used by Machine sketches."
---

These words are not display or input words, but they are part of the practical
Machine sketch surface.

## Timing

**`millis:`** *(timing)* `() -> Int`

Behavior: Return current uptime in milliseconds.

```froth
millis:
```

**`ms:`** *(timing)* `(durationMs) -> nil`

Behavior: Sleep for the given number of milliseconds.

```froth
ms: 75
```

## Random

**`random.below:`** *(utility)* `(n) -> Int`

Behavior: Return a random integer from `0` to `n - 1`.

```froth
random.below: grid.width
```

## Math

**`min:`** *(utility)* `(a, b) -> Int`

Behavior: Return the smaller value.

```froth
min: player.x, target.x
```

**`max:`** *(utility)* `(a, b) -> Int`

Behavior: Return the larger value.

```froth
max: player.x, 0
```

**`clamp:`** *(utility)* `(value, lo, hi) -> Int`

Behavior: Clamp a value to the inclusive range `lo..hi`.

```froth
clamp: player.x, 0, (grid.width - 1)
```

**`wrap:`** *(utility)* `(value, size) -> Int`

Behavior: Wrap a value into the range `0..size - 1`.

```froth
wrap: player.x, grid.width
```

**`map:`** *(utility)* `(value, inLo, inHi, outLo, outHi) -> Int`

Behavior: Linearly map a value from one range to another.

```froth
map: knob.right:, 0, 100, 180, 20
```

The longer `math.*` names are also present in the base library. The short
aliases are the names used in beginner material.
