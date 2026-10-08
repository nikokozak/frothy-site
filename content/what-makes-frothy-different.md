---
aliases:
  - /what-makes-froth-different/
title: "How Frothy Is Different"
description: "What Frothy does well, what it does not do yet, and the design choices behind it."
---

Frothy is a small language that runs on the board. You send code to the board
while it runs. A definition takes effect at once, and a call runs at once. When
you define a word again, the next call uses the new word. You do not build
firmware or upload it again, and the board does not restart.

## The Board Keeps And Shows Your Program

`save` writes your words to the flash of the board. After a restart, the board
loads them, and it runs a word named `boot` if you define one. The board does
not need the computer that wrote the words.

The board can also show you what it has. `words` lists the names, and `see`
prints the code of a word:

```text
see led.toggle
base source code
to led.toggle [ gpio.toggle: $led_builtin ]
```

## Choose Frothy When

- you want to try a board, a sensor or an idea one line at a time;
- you want the board to keep its program and to show it to you again;
- you teach, and you want each line to act on the hardware at once.

## Choose Another Tool When

- you need floating-point numbers, SPI, UDP, MQTT or HTTPS;
- you need a ready-made library for a display or another complex part;
- your program is large: an ESP32 board holds 256 of your names, an RP2040
  board holds 192, and [Limits](/limits/) lists the other sizes;
- you need a prompt over Wi-Fi or Bluetooth, or a prompt with a password;
- your board is not one of the [supported boards](/boards/).

[Coming from Arduino](/coming-from-arduino/) shows how the parts of a sketch
map to Frothy.

## Design Choices

- **Stable names.** A top-level name always refers to the same slot. When you
  define a word again, its callers use the new code at their next call.
- **No captured locals.** Code reads its own parameters and locals, and the
  top-level names. An event body cannot read the locals of the word that
  registered it.
- **Fixed memory.** Each table has a fixed size. When a table is full, the board
  stops the form with error 4 and names the table.
- **The prompt owns `save`, `restore` and `dangerous.wipe`.** A running word
  cannot call them, so a program cannot replace itself.
- **Safe boot on ESP32 boards.** For 600 ms after start, Ctrl-C or the BOOT
  button skips the saved program. On an RP2040 board, Ctrl-C stops a `boot`
  that does not end.
- **The serial prompt comes first.** Any serial terminal can use a Frothy board.
  The browser editor, the CLI and the VS Code extension use the same prompt.
