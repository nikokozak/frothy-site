---
title: "Timing"
weight: 6
description: "Board timing words for sleeping and reading monotonic uptime."
---

Use this page when you need the hardware timing contract for sleeps and uptime reads.

Timing words are simple on purpose: sleep for a while, or ask how long the board has been awake. The canonical word entries are in the [Word Catalog](/reference/words/).

## Word Table

| Word | Args | Result | Behavior |
| --- | --- | --- | --- |
| [`ms`](/reference/words/#ms) | 1 | `nil` | Sleep for a nonnegative number of milliseconds. |
| [`millis`](/reference/words/#millis) | 0 | `Int` | Read milliseconds since boot, wrapped to the tagged integer range. |
| [`micros`](/reference/words/#micros) | 0 | `Int` | Read microseconds since boot, wrapped to the tagged integer range. |

## `ms`

`ms` decodes one nonnegative integer argument, delays one millisecond at a
time, polls for interrupts during the delay, and returns `nil`. A negative
duration is a domain error.

```frothy
ms: 75
```

Use `ms` for simple sketches, not hard real-time scheduling. While `ms` is
running, no later Frothy code in that evaluation proceeds.

## Uptime Reads

`millis` takes no arguments and returns platform uptime in milliseconds. On
the current 32-bit tagged-int profile, the user-visible value wraps after
`FR_TAGGED_INT_MAX + 1` milliseconds, about 12.4 days.

```frothy
millis:
```

`micros` takes no arguments and returns platform uptime in microseconds. On the
same profile, the user-visible value wraps after about 17.9 minutes. Modular
deltas across that wrap remain useful for short spans.

## Relationship To Utilities

Timing often appears alongside random and math helpers in small board sketches.
This page is the low-level timing contract; higher-level helpers such as
[`blink`](/reference/words/#blink) and [`led.blink`](/reference/words/#led-blink)
are board-library words layered on top of GPIO and `ms`.
