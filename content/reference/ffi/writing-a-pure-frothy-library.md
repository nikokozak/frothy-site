---
title: "Writing a pure-Frothy library"
weight: 2
description: "Create a library with `lib.fr`, optional `lib.toml`, and no C."
tags: [libraries]
---

A pure-Frothy library is just Frothy words. The required file is `lib.fr`.
`lib.toml` is optional.

`lib.toml`:

```toml
name    = "servo"
version = "0.1.0"
boards  = ["host", "esp32_devkit_v1"]
```

`lib.fr`:

```frothy
-- Attach a servo on a pin. Returns a handle to pass to the other words.
to servo.attach with pin [ pwm.open: pin, 50 ]

-- Move to an angle from 0 to 180 degrees.
to servo.write with servo, angle [ pwm.write: servo, map: angle, 0, 180, 250, 1250 ]
```

`boards` gates which boards may use the library. A library with no `lib.toml`
is a pure-modules library that implicitly supports every board. Its
name is its directory name.

If `lib.toml` is present, its `name` must equal the directory name.

Publish the directory to GitHub when you want other projects to consume it by
URL and revision. [frothy-servo](https://github.com/nikokozak/frothy-servo) is
the real public example for that flow.
