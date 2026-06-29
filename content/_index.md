---
title: "Frothy"
description: "Learn the live lexical language for programmable devices."
---

**Frothy is a small live language for programmable devices.**

It is early, rough, and changing quickly. The useful thing is already there: you can flash an ESP32, open a prompt, define words, inspect what the board knows, and save your work back onto the device.

If you are new here, treat Frothy less like a finished product and more like a small instrument on the bench. It can do real things, but it still asks for patience.

## A First Conversation

```text
frothy> led.on:
ok
frothy> ms: 250
ok
frothy> led.off:
ok
frothy> 2 + 3
5
```

The board is not a black box at the end of an upload. It is the computer you are talking to.

## Why Frothy?

Most embedded programming goes like this: write code, compile, upload, wait, and hope. Once the program is on the microcontroller, it can be hard to ask what is actually there.

Frothy turns that into a conversation. You define a word. You run it. You redefine it. You ask the board to show you what it knows. When something works, you save it.

```frothy
to pulse with pin, wait [
  gpio.high: pin;
  ms: wait;
  gpio.low: pin
]

to blink with pin [
  repeat 3 [
    pulse: pin, 75;
    ms: 75
  ]
]

blink: $led_builtin
save
```

If none of this made sense: **Frothy feels a bit like p5.js, but the canvas is a real circuit.**

## What You Can Do Now

- build the `frothy` CLI from source
- bootstrap the ESP32 toolchain
- flash an ESP32 over USB serial
- connect to a live prompt
- send `.fr` files from a terminal or VS Code
- inspect definitions with `words` and `see`
- save and restore device state
- write small C/native extensions when a project really needs one

The current happy path is an ESP32 development board. The command examples use `esp32_devkit_v1` because that is the board identifier used during development. Most classic Tensilica ESP32 dev boards should be plausible; newer RISC-V ESP32 boards have not been tried yet.

## Start Here

- [Install Frothy](/install/) to build the CLI, bootstrap ESP-IDF, flash, and connect.
- [Read the guide](/guide/) for the language and live workflow.
- [Follow a tutorial](/tutorials/) when you want a task-shaped path.
- [Use the reference](/reference/) when you need exact command or word behavior.
- [Read how Frothy is different](/what-makes-frothy-different/) for the deeper design context.
