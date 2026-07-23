---
title: "Timing"
weight: 3
url: /reference/modules/timing/
aliases:
  - /reference/hardware/timing/
description: "Interruptible millisecond delays, monotonic uptime reads, wrap-safe deltas, and when to use events instead."
icon: clock
tags: [timing, millis, micros]
---

Timing has two jobs: pause a straightforward sequence, or measure elapsed time.
Use events when code should react later without holding the foreground
evaluation.

## Blink With A Delay

```frothy
repeat 3 [
  led.on:
  wait: 75
  led.off:
  wait: 75
]
```

`wait` accepts a nonnegative millisecond count, polls for Ctrl-C once per
millisecond, and returns `nil`. Later expressions in the same word do not run
until the delay finishes.

## Measure A Short Span

```frothy
started is millis:
wait: 25
finished is millis:
elapsed is 0
set elapsed to finished - started
```

| Word | Result | Current 32-bit wrap period |
| --- | --- | --- |
| [`wait`](/reference/words/#wait) | `nil` | not applicable |
| [`millis`](/reference/words/#millis) | `Int` | about 12.4 days |
| [`micros`](/reference/words/#micros) | `Int` | about 17.9 minutes |

The visible clocks wrap at the tagged integer ceiling. Short modular deltas
across the wrap remain useful; do not treat either clock as a wall-clock date or
an indefinitely increasing persisted counter.

## Milliseconds Are The Unit

Durations are plain integers, and the unit belongs to the word: `wait` and
the timer events take milliseconds, and a word with a different unit carries
it in its name (`pulse.duration-ns`, `trace.delta-ns`). Millisecond
resolution is also the floor for delays — `wait` sleeps in 1-millisecond
steps. Nanosecond-scale timing exists only where dedicated hardware provides
it: the [signal words](/reference/modules/signals/) capture and emit edges
with 100-nanosecond quantization.

## Delay, Timer Event, Or Signal Hardware?

- Use `wait` for a short, linear sequence.
- Use `after` or `every` when work should run at a later safe point while the
  prompt remains live.
- Use `trace.*` or `pulse.*` when edge timing must be captured or emitted with
  100-nanosecond hardware quantization.

Continue with [Events](/reference/modules/events/) or [Digital
signals](/reference/modules/signals/).
