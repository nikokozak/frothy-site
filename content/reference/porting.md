---
title: "Porting to a new target"
weight: 7
description: "Bring Frothy to a new MCU by implementing one platform header."
advanced: true
icon: cpu
tags: [porting, platform, target, board]
---

Frothy's kernel — parser, compiler, VM, persistence, event scheduler — is
portable C with no target dependencies. Everything hardware-specific sits
behind **one header, `src/platform.h`**. Porting Frothy to a new MCU (STM32,
RP2040, nRF, an AVR variant) means implementing that header against your chip's
SDK. Nothing else in `src/` should need to change.

This guide is the contract. The authoritative surface is always the header
itself — read `src/platform.h` alongside this document, and read
`targets/host/platform.c` as the reference implementation (it implements the
whole seam in a single file).

## The four layers

A working target is four small pieces. Only the first is real porting work; the
rest are declaration.

| Layer | Lives in | What it is |
|-------|----------|------------|
| **Target** | `targets/<name>/platform.c` + `target.mk` | The `fr_platform_*` implementation. This is the port. |
| **Board** | `boards/<board>/{board.h, board.json, board.mk, board_defs.c}` | Pin numbers and the board-owned base words (`$led_builtin`, `$a0`, …). |
| **Profile** | `profiles/<name>.h` | Sizing: slot count, image bytes, stack depth, table sizes. |
| **Build wiring** | `board.json` names the target + profile; `target.mk` lists sources | How the three above get selected. |

The build selects a target with `TARGET` (defaulted from the board). It then
includes `targets/$(TARGET)/target.mk`, which appends your `platform.c` to the
source list. A missing `target.mk` is a hard build error. So a new target is
literally: create `targets/<name>/`, drop in `target.mk` and `platform.c`,
point a board at it.

```make
# targets/host/target.mk — the whole thing
TARGET_CC ?= cc
TARGET_SOURCES += targets/common/target_defs.c targets/host/platform.c
```

## The hook checklist

`src/platform.h` is the complete list; implement every function it declares.
They group into six families. The host port implements all of them in
`targets/host/platform.c` — copy its structure.

**Timing** — the scheduler's heartbeat.
- `fr_platform_delay_ms`, `fr_platform_millis`, `fr_platform_micros`
- `fr_platform_yield` — let the platform scheduler run without changing Frothy
  program state. On a bare-metal port this can be empty; on an RTOS it yields.

**GPIO / ADC** — the first hardware anyone tests.
- `fr_platform_gpio_mode`, `fr_platform_gpio_write`, `fr_platform_gpio_read`
- `fr_platform_adc_read`

**Handles** — resource cleanup.
- `fr_platform_handle_close(kind, platform_index)` — release a peripheral a
  Frothy handle owned (a PWM channel, an I2C bus).

**Heap reporting** — optional, honest defaults.
- `fr_platform_heap_free`, `fr_platform_heap_largest` — return `0` with an OK
  status when the platform can't report. That is not an error; it means "don't
  know", and the language surfaces it as such.

**Events** — see the event contract below.
- `fr_platform_event_drain` — hand queued candidates to the kernel.
- `fr_platform_event_gpio_install/remove`,
  `fr_platform_event_timer_install/remove` (and the WiFi pair under
  `FR_FEATURE_NET`) — arm and disarm the sources.

**Interrupt polling** — a safe-point check, unrelated to the event queue.
- `fr_platform_poll_interrupt(runtime)` — the kernel calls this at safe points
  (between VM steps, while blocked) to check whether the user interrupted
  (Ctrl-C). On the host it is a no-op returning `FR_OK`. It does NOT touch the
  event queue; do not drain events here.

**Persistence** — see the persistence contract below.
- the `fr_platform_persist_stream_*` family (write path) and the
  `fr_platform_persist_*` mount/read/clear family (restore path).

You do not have to land all six at once. A useful port order is: timing → GPIO
→ ADC → handles (stub heap as `0`, events and persistence as
`FR_ERR_UNSUPPORTED`). That gets you a live REPL blinking an LED. Add events and
persistence after.

## The persistence contract

Persistence is a save/restore of the live image to non-volatile storage. The
kernel drives it through two seams your port must satisfy; how you store bytes
(internal flash, external QSPI, an NVS partition, a file on host) is yours.

**Write path** — a streaming sink, called by `fr_persist_save`:
1. `fr_platform_persist_stream_begin()` — open a fresh write region.
2. `fr_platform_persist_stream_write(bytes, length)` — append, possibly many
   times. Must tolerate the total image size for your profile.
3. `fr_platform_persist_stream_finalize(header)` — commit atomically. After
   this returns OK, the image is durable and discoverable by the read path.
4. `fr_platform_persist_stream_abort()` — discard a partial write. After abort,
   no partially-written image is ever visible to the read path.

The commit must be atomic in the face of power loss: a half-written image must
never present a valid envelope. Do the commit as the last step (flip a header,
swap an active-slot marker), never in the middle of streaming.

**Restore path** — borrow or copy a committed image:
- `fr_platform_persist_mount(image_index, &image, &image_length)` — hand back a
  pointer to a committed image. Index `0` is the newest valid-envelope image;
  higher indexes walk older ones (this is how recovery falls back). The pointer
  may be into memory-mapped flash (zero-copy / XIP) — it need not be RAM.
- `fr_platform_persist_mount_commit()` / `fr_platform_persist_mount_discard()`
  / `fr_platform_persist_unmount()` — the mount lifecycle for a restore that
  may or may not accept the image.
- `fr_platform_persist_read(bytes, cap, &out_length, image_index)` — the
  copying variant, when the caller needs its own buffer.
- `fr_platform_persist_clear()` — wipe all committed images.

The image envelope carries the profile hash. A save taken under one profile is
cleanly rejected at restore under an incompatible profile — your port does not
need to check this, but it must preserve the bytes faithfully so the kernel's
check works. Preserve bytes exactly; do not reorder or pad the stream.

## The event contract

Frothy's `every`, `after`, and pin-edge handlers are driven by a candidate
queue. Your port produces candidates from interrupts and timers; the kernel
drains and dispatches them on the main loop — handlers never run in ISR
context.

There are three distinct roles here — keep them straight:

- **Your ISR/timer side** produces candidates. On a hardware event (GPIO edge,
  timer expiry), enqueue an
  `fr_event_candidate_t { binding_index, generation, timestamp_ms }` into a
  small queue and return. The install calls
  (`fr_platform_event_gpio_install`, `fr_platform_event_timer_install`) tell you
  which `binding_index` and `generation` to stamp on that source.
- **`fr_platform_event_drain(out_events, out_cap, out_count, overflow_delta)`**
  is the hook that empties your queue. The kernel calls it (from its own
  `fr_event_drain`) with a buffer of capacity `out_cap`; copy up to `out_cap`
  queued candidates into `out_events`, set `*out_count`, and report via
  `*overflow_delta` how many candidates you had to drop since the last drain
  (queue full). This is the seam between your ISR queue and the kernel.
- **The kernel** then dispatches: its `fr_event_dispatch` runs the actual
  handler bodies on the main loop. Handlers never run in ISR context, which is
  why heavy work in an ISR is never required.

`generation` guards against stale bindings: when a handler is replaced or
removed, its generation is bumped, and drained candidates carrying the old
generation are discarded by the kernel. Stamp every candidate with the
generation you were given at install time; the kernel does the discarding.

Keep the ISR side minimal: capture `binding_index`, `generation`, and a
timestamp into the queue, and return. `event_drain` moves them out; the kernel
does the rest.

## Board and profile

Once the target compiles, a board declares the concrete pins and words:

- `board.h` — plain `#define`s for pin numbers (`FR_BOARD_LED_BUILTIN`, …).
- `board_defs.c` — the base-def table binding user-facing base words
  (`$led_builtin`, `$a0`, `$boot_button`) to those pins. Board-local slots
  start at `FR_SLOT_BOARD_LOCAL_BASE`.
- `board.json` — metadata: `name`, `chip`, `target`, `profile`, `peripherals`,
  `pins`. This is what selects your target and profile.
- `board.mk` — board-specific build variables.

A profile (`profiles/<name>.h`) is a header of `FR_PROFILE_*` sizing macros
plus `FR_WORD_SIZE`. Start by copying `profiles/host_normal.h` and shrinking the
table sizes to your RAM budget. The profile is also what the save-compatibility
hash is computed against, so two builds that must share saves need the same
profile.

## A minimal port, start to finish

Say you're bringing up an STM32.

1. `targets/stm32/target.mk` — set `TARGET_CC` to your cross-compiler and
   `TARGET_SOURCES += targets/common/target_defs.c targets/stm32/platform.c`.
2. `targets/stm32/platform.c` — implement `src/platform.h`. Wire timing to
   SysTick, GPIO/ADC to the HAL. Return `FR_ERR_UNSUPPORTED` from the event and
   persistence functions for now; return `0` from the heap functions.
3. `profiles/stm32_plain.h` — copy `host_normal.h`, size the tables to your RAM.
4. `boards/nucleo_f4/` — `board.h` with your pins, `board_defs.c` binding
   `$led_builtin` to the on-board LED, `board.json` naming target `stm32` and
   profile `stm32_plain`.
5. Build and flash. You now have a live Frothy REPL over UART; `gpio.write:
   $led_builtin, 1` lights the LED.
6. Add the event installs + `fr_platform_event_drain` (backed by a small
   ISR-filled queue) to get `every`/`after`/edges. `poll_interrupt` can stay a
   no-op until you want Ctrl-C interruption.
7. Add the persistence family last, against your flash layout, so `save` and
   `restore` work across reboots.

Each step is independently testable on hardware. Don't try to land all of
`platform.h` before the first blink — the seam is designed so a partial port is
a running port.
