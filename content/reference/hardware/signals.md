---
title: "Digital Signals"
weight: 12
url: /reference/modules/signals/
description: "Capture bounded digital edges and transmit finite, 100-nanosecond-quantized pulse waveforms."
icon: activity
tags: [trace, pulse, timing, gpio]
---

The signal modules sit below human-scale events. `trace.*` records edge timing
on up to three pins; `pulse.*` transmits a finite high/low waveform. Both use
live handles and 100-nanosecond time quantization.

## Capture Edges

```frothy
capture is trace.open:
sda-channel is trace.watch: capture, $sda
scl-channel is trace.watch: capture, $scl

trace.arm: capture
trace.wait: capture, 1000
trace.dump: capture

trace.close: capture
set capture to nil
```

One trace capture can be open at a time. Add one to three pins while it is in
the configuring state, then arm it. The capture completes when stopped, when
its 256-edge buffer fills, or when its one-second maximum span is reached.

### Trace Words

| Word | Result | Use |
| --- | --- | --- |
| [`trace.open`](/reference/words/#trace-open) | `Handle` | Open the single capture |
| [`trace.watch`](/reference/words/#trace-watch) | `Int` | Add a pin; receive channel `0..2` |
| [`trace.arm`](/reference/words/#trace-arm) | `nil` | Clear old edges and start capture |
| [`trace.wait`](/reference/words/#trace-wait) | `Bool` | Wait interruptibly up to 60000 ms |
| [`trace.stop`](/reference/words/#trace-stop) | `nil` | Finish an armed capture now |
| [`trace.complete?`](/reference/words/#trace-complete) | `Bool` | Test for completed state |
| [`trace.count`](/reference/words/#trace-count) | `Int` | Number of recorded edges |
| [`trace.channel`](/reference/words/#trace-channel) | `Int` | Channel for one edge |
| [`trace.level`](/reference/words/#trace-level) | `Int` | Level after one edge |
| [`trace.delta-ns`](/reference/words/#trace-delta-ns) | `Int` | Time since the previous edge |
| [`trace.dump`](/reference/words/#trace-dump) | `nil` | Print configuration and edges |
| [`trace.close`](/reference/words/#trace-close) | `nil` | Release the capture |

Inspect edges programmatically only after completion:

```frothy
when trace.complete?: capture [
  repeat (trace.count: capture) as i [
    print: (text.from-int: trace.channel: capture, i)
    print: ":"
    print: (text.from-int: trace.delta-ns: capture, i)
    print: "\n"
  ]
]
```

The first edge's delta is relative to the arm point; later deltas are relative
to the previous captured edge. `trace.wait` returns false on timeout without
automatically discarding the capture; use `trace.stop` to make partial results
readable.

## Transmit A Waveform

```frothy
wave is pulse.open: 4, 0
pulse.add: wave, 1, 800
pulse.add: wave, 0, 450
pulse.add: wave, 1, 800

pulse.dump: wave
pulse.play: wave

pulse.close: wave
set wave to nil
```

One pulse output can be open at a time. `idle_level` and every segment level
must be `0` or `1`. A requested duration is quantized to 100-nanosecond ticks;
`pulse.add` returns the actual duration so code can observe the rounding.

### Pulse Words

| Word | Result | Use |
| --- | --- | --- |
| [`pulse.open`](/reference/words/#pulse-open) | `Handle` | Open a pin with idle level `0` or `1` |
| [`pulse.add`](/reference/words/#pulse-add) | `Int` | Append a span and return actual nanoseconds |
| [`pulse.clear`](/reference/words/#pulse-clear) | `nil` | Remove all spans, keep output open |
| [`pulse.count`](/reference/words/#pulse-count) | `Int` | Number of spans |
| [`pulse.level`](/reference/words/#pulse-level) | `Int` | Level of one span |
| [`pulse.duration-ns`](/reference/words/#pulse-duration-ns) | `Int` | Actual duration of one span |
| [`pulse.dump`](/reference/words/#pulse-dump) | `nil` | Print the waveform |
| [`pulse.play`](/reference/words/#pulse-play) | `nil` | Transmit once and wait for completion |
| [`pulse.close`](/reference/words/#pulse-close) | `nil` | Return to idle and release the output |

A waveform holds up to 256 spans and at most one second of total duration.
Playback is one-shot and interruptible; use a loop for repetition. Use PWM for
an ongoing periodic duty cycle and GPIO events for human-scale edges.

Trace and pulse handles are volatile. Close them and replace any top-level
handle binding before `save`.
