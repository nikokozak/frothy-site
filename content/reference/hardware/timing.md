---
title: "Timing"
weight: 6
description: "Board timing words for sleeping and reading monotonic uptime."
---

Timing words are target-facing because they depend on the platform. ESP32
uses the board/RTOS delay path. POSIX uses host-side sleep.

## Words

**`ms:`** `(durationMs) -> nil`

Blocks for the requested number of milliseconds.

```frothy
ms: 75
```

Use it for simple sketches, not hard real-time scheduling. While `ms` is
running, no other Frothy code in that evaluation proceeds.

**`millis:`** `() -> Int`

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

The [Utilities](/reference/hardware/utilities/) page lists timing alongside
random and math helpers because those words often appear together in Machine
sketches. This page is the low-level timing contract.
