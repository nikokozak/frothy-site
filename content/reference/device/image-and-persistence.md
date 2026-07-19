---
title: "Image and Persistence"
weight: 2
description: "Base versus overlay, rebinding, `save`, `restore`, `dangerous.wipe`, and `boot`."
aliases:
  - /reference/image-and-persistence/
  - /reference/snapshot-format/
icon: save
tags: [save, restore, boot]
---

Frothy persists the overlay image and rebuilds the base image at boot.

## Image Shape

**`base image and overlay image`** *(image model)*

Layer: `core`  
Behavior: The base image contains built-ins, foreign bindings, standard
library, and board library. The overlay contains user-created top-level state
after boot.  
Example:

```text
`gpio.write` is a base-image slot; `myProgram` is usually an overlay slot.
```

Worked example:

```frothy
pulse is fn [ led.on: ]
message is "draft"
```

Here `pulse` and `message` live in the overlay. `led.on` remains a base-image
name even when your overlay code calls it.

**`rebinding and base-name shadowing`** *(image model)*

Layer: `core`  
Behavior: Rebinding updates the current value stored in a stable slot. Base
names may be shadowed by overlay writes, but `dangerous.wipe` restores the
boot-rebuilt base value.  
Example:

```frothy
blink is fn [ 99 ]
dangerous.wipe
```

Worked example:

```frothy
see blink
blink is fn [ "temporary overlay version" ]
see blink
dangerous.wipe
see blink
```

The first and third `see blink` come from the base image. The middle one is
your overlay shadowing that same stable slot name.

## Persistence Operations

**`save`** *(interactive base image)*

Layer: `core`  
Behavior: Snapshots the overlay image only. The saved walk includes overlay
top-level bindings plus persistable objects they own.  
Example:

```frothy
save
```

Worked example:

```frothy
record Cursor [ x, y ]
cursor is Cursor: 2, 3
save
```

What is saved here is the overlay slot `cursor` plus the persistable record
value it owns.

At the prompt, `save` has two non-error response shapes:

- `ok` with no notice means the new overlay was made durable
- `notice: not saved (13)` followed by its details and `ok` means evaluation
  completed, but the durable write did not happen

`save` can also fail outright—for example because the snapshot exceeds
capacity or storage I/O fails. Those responses use an `error:` headline and do
not end in `ok`.

For example, a top-level live handle prevents a snapshot:

```text
> save
notice: not saved (13)
detail: cannot save slot 'appuart' - bound to a live handle or buffer
ok
>
```

The live overlay remains usable and the previously saved overlay remains
intact. Close the resource, rebind the named top-level slot to `nil` or another
persistable value, and save again. Hardware needed after restore belongs in
`boot`.

The notice presentation applies only when the complete prompt form is bare
`save` or `save:`. When `save:` is evaluated as part of another word or
expression, the same condition is `error: not saved (13)`. That failure can be
caught by `attempt`/`rescue` and stops the rest of the current form. See the
complete [error and notice contract](/errors/#code-13).

**`restore`** *(interactive base image)*

Layer: `core`  
Behavior: Replaces the live overlay with the persisted overlay. If restore
fails, the runtime must remain in a usable base state.  
Example:

```frothy
restore
```

Worked example:

```frothy
record Cursor [ x, y ]
cursor is Cursor: 2, 3
save
set cursor->x to 9
restore
cursor->x
```

After `restore`, `cursor->x` is back to `2`.

**`dangerous.wipe`** *(interactive base image)*

Layer: `core`  
Behavior: Clears both the live overlay and the stored overlay and returns the
running image to base-only state.  
Example:

```frothy
dangerous.wipe
```

Worked example:

```frothy
record Session [ count ]
session is Session: 4
save
dangerous.wipe
session
```

After `dangerous.wipe`, reading `session` is an error because both the live and
saved overlay copies are gone.

## Boot and Recovery

**`boot`** *(top-level slot)*

Layer: `core`  
Behavior: If `boot` holds `Code` after restore, the runtime executes it before
entering the prompt.  
Example:

```frothy
boot is fn [ led.on: ]
```

Worked example:

```frothy
record State [ ready ]
state is State: false

boot is fn [
  set state->ready to true;
  led.on:
]

save
```

On the next restore path, `boot` runs before the prompt and can finish that
small startup step.

**`safe boot`** *(recovery surface)*

Layer: `core`  
Behavior: Lets you interrupt startup before restore and `boot` finish, so bad
saved state does not trap the device in a broken loop.  
Example:

```text
Press Ctrl-C during the safe-boot window, then inspect `boot` or wipe the overlay.
```

Typical recovery flow:

```text
1. Connect to the device.
2. Press Ctrl-C during the safe-boot window.
3. Run `see boot`.
4. Fix the bad slot, or run `dangerous.wipe`.
```

## Snapshot Format Boundary

The public contract is the model above: base image, overlay image, pointer-safe
restore, and recovery to a usable prompt. The binary snapshot format is an
implementation detail and may change while the pre-release runtime settles.

The important public constraints are stable:

- the base image is not duplicated into the snapshot
- overlay bindings are restored by symbol identity
- persistable code, text, records, and cells payload are serialized as values,
  not raw pointers
- native driver handles and live execution state do not persist
- incompatible snapshots must be rejected rather than half-restored

That is why persisted code can call `gpio.write` after restore without storing
the C function pointer. The restored overlay resolves `gpio.write` against the
boot-rebuilt base image.
