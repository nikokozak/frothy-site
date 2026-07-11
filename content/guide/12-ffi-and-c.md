---
title: "12. Libraries and Native Words"
description: "How libraries enter a Frothy project, and when a library should add C."
weight: 12
aliases:
  - /guide/09-extending-with-ffi/
advanced: true
icon: plug-zap
readTime: "4 min"
---

Frothy has no separate foreign-call system. It has libraries.

A library is a directory with `lib.fr` and, optionally, `lib.toml`. A project
consumes libraries through `[deps]` in `frothy.toml`:

```toml
name   = "stage-lights"
board  = "esp32_devkit_v1"

[deps]
servo = { git = "https://github.com/nikokozak/frothy-servo", rev = "2f40b97c8ab32ca604ee4e685acc23cc129da9ea" }
blink = { path = "libs/blink" }
```

Git dependencies are pinned by `rev` or follow a `branch`. Path dependencies
are local directories relative to the project. `frothy fetch` pre-fetches git
dependencies; `frothy build` resolves dependencies and compiles them in.

## Pure Libraries

A pure-Frothy library has ordinary Frothy word definitions in `lib.fr`:

```frothy
-- Attach a servo on a pin. Returns a handle to pass to the other words.
to servo.attach with pin [ pwm.open: pin, 50 ]

-- Move to an angle from 0 to 180 degrees.
to servo.write with servo, angle [ pwm.write: servo, map: angle, 0, 180, 250, 1250 ]
```

`lib.toml` can name the library, set a version, and gate supported boards. If
`lib.toml` is present, its `name` must match the directory name. Without
`lib.toml`, the library is a pure-modules library that supports every board.

The public example is
[frothy-servo](https://github.com/nikokozak/frothy-servo).

## Native Words

A native library adds C sources through `[extension]` and maps each native word
with `[[natives]]`. Native word names look like normal Frothy words, such as
`neopixel.show`, but their implementation is compiled into the firmware.

Values that cross the C boundary are Int, Bool, Nil, and, where a word supports
it, Text or Bytes. Raw pointers and driver handles are not persistable Frothy
values. Expose a small integer handle instead.

Native words live in the firmware base image. A saved overlay references them by
name. At boot, the native implementation is rebuilt from firmware, so saved
images stay pointer-safe.

## Where To Read Next

Use the [Extending reference](/reference/ffi/) for the exact library manifest
shape, native C signature, and generated build files.

Use [Project and Build](/reference/toolchain/project-and-build/) when the
question is how the CLI selects boards, libraries, native sources, and build
directories.
