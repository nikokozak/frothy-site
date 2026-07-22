---
title: "02. Getting Started"
description: "Your first live session: connect, evaluate small expressions, inspect names, and blink the built-in LED."
weight: 2
aliases:
  - /guide/07-projects-build-and-flash/
icon: play
readTime: "6 min"
---

If you do not have a prompt yet, start with [Install](/install/). The rest of this chapter assumes `frothy doctor` passes and an ESP32 is reachable.

Connect:

```sh
frothy connect
```

Type a value:

```frothy
42
```

The prompt evaluates the expression and prints the result. That is the first habit to learn: do one small thing, look at the response, and continue.

## Values, Not A Scratch Stack

```frothy
delay is 75
delay

delay is 120
delay
```

The name stayed the same. The value stored in that top-level slot changed.

## Ask The Image What Exists

```frothy
words
see delay
status
```

`words` lists names. `see` asks the device to show one binding. `status` tells you what kind of session you are talking to.

## Blink The LED

```frothy
led.on:
wait: 200
led.off:
```

Then define a small word:

```frothy
to blink.once [
  led.on:;
  wait: delay;
  led.off:
]

blink.once:
```

Redefine it and run it again. That is the basic live loop.

## Send A File

When a definition grows past a few lines, put it in `main.fr` and send it:

```sh
frothy send main.fr
```

You do not need to flash for ordinary edits. Flashing is for installing or recovering firmware.

Next: [Values and expressions](/guide/03-the-stack/).
