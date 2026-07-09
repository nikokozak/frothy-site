---
title: "Extending Frothy"
weight: 5
description: "Use libraries, write pure Frothy libraries, and add native words when C is required."
icon: plug-zap
tags: [libraries, native, c]
---

Frothy has libraries. A library is a directory with `lib.fr` and, optionally,
`lib.toml`. Libraries can be pure Frothy or native.

Use these pages in order:

- [Using libraries](/reference/ffi/using-libraries/) for `[deps]`, git
  dependencies, local path dependencies, `frothy fetch`, and `frothy build`
- [Writing a pure-Frothy library](/reference/ffi/writing-a-pure-frothy-library/)
  for `lib.fr`, optional `lib.toml`, targets, and publishing a library
- [Native words](/reference/ffi/native-words/) for the C boundary inside a
  library
