---
title: "10. Snapshots and Persistence"
description: "Save the overlay image, restore it, wipe it, and understand what does not persist."
weight: 10
aliases:
  - /guide/06-persistence-boot-and-recovery/
---

Froth persists the overlay image, not the current execution.

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

```froth
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

```froth
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

## Restore

Use `restore` when you want the saved overlay back:

```froth
restore
```

Restore replaces the current live overlay with the saved one. If restore
fails, the runtime is expected to remain usable in a base state.

## `boot`

If the top-level name `boot` holds `Code` after restore, the runtime executes
it before entering the prompt.

```froth
to boot [
  matrix.init:;
  matrix.brightness!: 1;
  grid.clear:;
  grid.show:
]

save
```

Keep `boot` boring. Initialize hardware and start the smallest necessary
behavior. Do not hide a whole uninterruptible program behind it.

## Wipe

Use `dangerous.wipe` when the saved overlay is wrong:

```froth
dangerous.wipe
```

That clears both the live overlay and the stored overlay. Afterward the image
is base-only again.

The name is intentionally loud because this is not undo. It is the reset lever
for persistent user state.

Next: [Where to go next](/guide/11-where-to-go-next/).
