---
title: "Using libraries"
weight: 1
description: "Add Frothy libraries to a project with `[deps]` and build them in."
tags: [libraries, frothy.toml]
---

Frothy extends through libraries. A library is a directory with a mandatory
`lib.fr` file and an optional `lib.toml` manifest. It can be pure Frothy, or it
can define native words backed by C.

Projects consume libraries through `[deps]` in `frothy.toml`:

```toml
name   = "stage-lights"
board  = "esp32_devkit_v1"

[deps]
servo = { git = "https://github.com/nikokozak/frothy-servo", rev = "2f40b97c8ab32ca604ee4e685acc23cc129da9ea" }
blink = { path = "libs/blink" }
```

A dependency is either:

- `git`, with `rev` set to a commit SHA, or `branch` set to a branch name
- `path`, pointing at a local directory relative to the project

`frothy build` resolves dependencies, fetches git dependencies, and compiles
the libraries into the firmware image.

```sh
frothy build
```

Use `frothy fetch` when you want to pre-fetch git dependencies without building:

```sh
frothy fetch
```

Git dependencies are stored under
`$FROTH_HOME/deps/<host>/<owner>/<repo>/<rev>/`.

## Public Example

The worked public example is
[frothy-servo](https://github.com/nikokozak/frothy-servo). It is a pure Frothy
library with four words and an MIT license. Pin it by URL and revision in
`[deps]`, then build the project.

That is the normal path: consume a library first, write a pure Frothy library
when you need your own words, and use native words only when the boundary really
needs C.
