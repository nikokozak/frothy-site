---
title: "02. Getting Started"
description: "Your first live session: connect, evaluate small expressions, inspect names, and make one visible board change."
weight: 2
aliases:
  - /guide/07-projects-build-and-flash/
---

If you do not have a prompt yet, start with [Install](/install/). The rest of
this chapter assumes the `froth` command is available and a board or local
target is reachable.

Run the environment check first:

```sh
froth doctor
```

Then connect:

```sh
froth connect
```

On a machine with more than one serial device, pass the port explicitly:

```sh
froth --port /dev/tty.usbserial-XXXX connect
```

The exact prompt text is less important than the fact that the target is now
waiting for complete Froth forms. Type a value:

```froth
42
```

The prompt evaluates the expression and prints the result. That is the first
habit to learn: do one small thing, look at the response, and continue.

## Values, Not A Scratch Stack

You do not need to manage a visible data stack to start. A line is an
expression, and names are the main way you keep useful state around.

Create a top-level name:

```froth
delay is 75
delay
```

Now rebind it:

```froth
delay is 120
delay
```

The name stayed the same. The value stored in that top-level slot changed.
That is the core live workflow: define a name, use it, redefine it, and let
callers resolve the current value.

## Ask The Image What Exists

Use the inspection words early:

```froth
words
show @delay
info @delay
```

`words` lists the current live names. `show @name` gives the normalized view
of one binding. `info @name` reports metadata such as whether the binding is
base-image or user-created. Those words are not debugging afterthoughts; they
are how you keep a live system legible.

## Make One Visible Change

On a general ESP32 board, the smallest visible proof is the built-in LED:

```froth
gpio.output: LED_BUILTIN
gpio.high: LED_BUILTIN
ms: 200
gpio.low: LED_BUILTIN
```

On the Froth Machine, initialize the display and light one pixel:

```froth
matrix.init:
grid.clear:
grid.set: 1, 1, true
grid.show:
```

That is enough to prove that source text from your keyboard is reaching the
device and changing hardware.

## Send A File When The Line Gets Too Long

The prompt is for short experiments. Once a definition grows past a few lines,
put it in `src/main.froth` or another source file and send it:

```sh
froth send src/main.froth
```

Project builds and firmware flashing use:

```sh
froth build
froth flash
```

You do not need those commands for every edit. Most learning happens through
`connect` and `send`, with `build` and `flash` reserved for changing the
firmware image, board profile, or project FFI.

Next: [Values and expressions](/guide/03-the-stack/).
