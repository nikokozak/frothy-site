---
title: "10. Snapshots and Persistence"
description: "Save the overlay image, restore it, wipe it, and understand what does not persist."
weight: 10
aliases:
  - /guide/06-persistence-boot-and-recovery/
icon: save
readTime: "8 min"
---

Frothy persists the overlay image, not the current execution.

That distinction is the difference between a durable live system and a
half-frozen call stack. A saved image remembers top-level user state. It does
not remember an in-flight loop, a local scope, or a native peripheral handle.

## Base Image And Overlay

At boot, the runtime rebuilds the base image:

- language built-ins
- foreign bindings
- standard library
- board pins
- board library

After boot, your top-level edits form the overlay:

```frothy
speed is 75
to pulse with pin [
  gpio.high: pin;
  wait: speed;
  gpio.low: pin
]
```

Saving persists the overlay part. The base image is rebuilt from firmware on
the next boot.

## Save

Use `save` when the current overlay is worth keeping:

```frothy
save
```

The saved image includes user-created top-level bindings and persistable code,
text, cells descriptors, and cells payload directly owned by those bindings.

It does not include:

- the data stack or return stack
- the current local scopes
- in-flight evaluation
- live console state
- native runtime pointers
- peripheral configuration that must be reinitialized

Put hardware setup in `boot` if it must happen after restore.

## What Save Does With Live Handles

Live `Handle` values cannot be serialized. A bare `save` writes those slots as
`nil` and tells you which ones, instead of refusing:

```text
> save
notice: saved; handle values stored as nil (100)
detail: 'appuart' was stored as nil - recreate it in boot so a reboot brings it back
ok
>
```

The save happened. Your session is untouched — `appuart` still holds its open
port and you keep working. Only the image says `nil` there, which is all it
could ever say, so put the reopening step in `boot`.

A few cases still refuse outright, because `nil` would lose something the
device cannot recover: a live Bluetooth connection, a slot installed in library
mode, and more handle-bound slots than the device can hold at once. Those
report `notice: not saved (13)`, leave the previous durable overlay unchanged,
and ask you to release the resource and replace its binding first:

```frothy
uart.close: appuart
set appuart to nil
save
```

If the resource is needed after restore, reopen it from `boot` instead of
persisting its native handle. See [Error and notice codes](/errors/#code-26)
for why a save inside a larger form is refused outright.

### Persist the Recipe, Not the Handle

A hardware resource has two different kinds of state:

- durable configuration and setup `Code`, which belong in the saved overlay
- the live `Handle`, which belongs only to the current runtime session

Persist the first and rebuild the second. Keep the live Handle in a top-level
slot with a falsey durable sentinel:

```frothy
sensor.port is 0
sensor.frequency is 400000
sensor.bus is false

to sensor.open [
  unless sensor.bus [
    set sensor.bus to i2c.open: sensor.port, $sda, $scl, sensor.frequency
  ]
]

to sensor.close [
  when sensor.bus [
    i2c.close: sensor.bus
    set sensor.bus to false
  ]
]

boot is fn [ sensor.open: ]
```

Closing releases the platform resource, but it does not rewrite the slot that
held the Handle. The explicit `set ... to false` is what makes the overlay
persistable. `false` also makes `when` and `unless` useful lifecycle guards.

During interactive work, save with this cycle:

```frothy
sensor.close:
save
sensor.open:
```

The saved overlay contains `sensor.bus is false` plus the configuration and
reopening recipe. Reopening afterward changes only the live overlay. On the next
restore, `boot` opens a fresh Handle for the new runtime session.

Do not hide this cycle inside one word. A successful `save` is a commit boundary:
execution does not continue into a later reopen expression in that definition.
Keep close, save, and reopen as separate foreground forms. A nested failed
`save:` is catchable with `attempt` and `rescue`, but Frothy has no
`finally`-style construct that can guarantee reopening after both outcomes.

Use the same shape for UART, PWM, TCP, BLE connections, and handle-bearing
native libraries: persist parameters and setup words, provide a matching close
word, clear every Handle slot before saving, and recreate resources from
`boot`. Session-scoped integer IDs should be rediscovered too, even though an
integer is technically persistable.

### Bytes Fail Before Save

`Bytes` are volatile too, but they fail earlier. For example, Frothy rejects a
top-level binding with the actual byte count in the headline:

```text
> x is bytes.from-text: "hi"
error: not saved: bytes 2 (13)
detail: value cannot be stored in a slot
>
```

Cells and record fields use the same `error: not saved: bytes N (13)` headline;
the detail line names the destination. Keep `Bytes` transient or convert them
to a persistable value when appropriate.

## Restore

Use `restore` when you want the saved overlay back:

```frothy
restore
```

Restore replaces the current live overlay with the saved one. If restore
fails, the runtime is expected to remain usable in a base state.

## `boot`

If the top-level name `boot` holds `Code` after restore, the runtime executes
it before entering the prompt.

```frothy
to boot [
  gpio.mode: $led_builtin, 1;
  led.on:
]

save
```

Keep `boot` boring. Initialize hardware and start the smallest necessary
behavior. Do not hide a whole uninterruptible program behind it.

## Wipe

Use `dangerous.wipe` when the saved overlay is wrong:

```frothy
dangerous.wipe
```

That clears both the live overlay and the stored overlay. Afterward the image
is base-only again.

The name is intentionally loud because this is not undo. It is the reset lever
for persistent user state.

Next: [Where to go next](/guide/11-where-to-go-next/).
