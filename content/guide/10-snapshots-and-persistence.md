---
title: "10. Snapshots and Persistence"
description: "Save the overlay image, restore it, wipe it, and understand what does not persist."
weight: 10
aliases:
  - /guide/06-persistence-boot-and-recovery/
icon: save
readTime: "5 min"
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
  ms: speed;
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

## When Save Is Not Durable

Live `Handle` values cannot be serialized. If a top-level binding still owns
one, a bare `save` reports a notice rather than pretending the image was
written:

```text
> save
notice: not saved (13)
detail: cannot save slot 'appuart' - bound to a live handle or buffer
ok
>
```

This is not a fatal programming error. The current overlay and device session
remain usable, so you can keep evaluating code. It is also not a successful
save: the previous durable overlay remains unchanged, and that older overlay
is what a later reboot or `restore` will load.

`Bytes` are volatile too, but they fail earlier: Frothy rejects an attempt to
put `Bytes` in a top-level slot, cell, or record field with an `error: not saved
(13)` response. Keep them transient or convert them to a persistable value
when appropriate.

Release the resource and replace its top-level binding before trying again:

```frothy
uart.close: appuart
set appuart to nil
save
```

If the resource is needed after restore, reopen it from `boot` instead of
persisting its native handle. See [Error and notice codes](/errors/#code-13)
for the distinction between a standalone save notice and a save error inside a
larger form.

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
