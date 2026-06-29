---
title: "Timing"
weight: 6
description: "Board timing words for sleeping and reading monotonic uptime."
---

Timing words are simple on purpose: sleep for a while, or ask how long the board has been awake.

## Words

**`ms:`** *(timing)* `(durationMs) -> nil`

Blocks for the requested number of milliseconds.

```frothy
ms: 75
```

Use it for simple sketches, not hard real-time scheduling. While `ms` is
running, no other Frothy code in that evaluation proceeds.

**`millis:`** *(timing)* `() -> Int`

Returns wrapped monotonic uptime in milliseconds.

```frothy
millis:
```

Use `millis` for elapsed-time checks when a loop should keep control:

```frothy
blink.last is 0

to blink.poll [
  when ((millis:) - blink.last) > 250 [
    led.toggle:;
    set blink.last to millis:
  ]
]
```

## Relationship To Utilities

Timing often appears alongside random and math helpers in small board sketches. This page is the low-level timing contract.
