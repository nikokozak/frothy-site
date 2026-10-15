---
title: "Agent Guide"
weight: 9
url: /agent-guide/
description: "Rules for an AI model that writes Frothy code: the syntax, the words that do not exist, the limits, and how to send code."
icon: bot
tags: [ai, agents, syntax, llms]
guideTopic: true
---

Frothy is not Forth. It has no data stack and no `: name ... ;` definitions. Do
not write Forth, Arduino C or MicroPython. This is Frothy code:

```frothy
to blink-twice with pin, delay [
  repeat 2 [
    gpio.high: pin
    wait: delay
    gpio.low: pin
    wait: delay
  ]
]

blink-twice: $led_builtin, 100
```

This guide matches Frothy v0.1.23. The [language reference](/reference/language/)
and the [word catalog](/reference/words/) give the rest, and
[llms-full.txt](/llms-full.txt) holds them in one file.

## Syntax Rules

1. **Define a word with `to`.** Write `to name with a, b [ ... ]`, or
   `to name [ ... ]` for a word with no parameters. The last expression of the
   body is the result. There is no `return`.
2. **Call a word with a colon.** Write `name: a, b`, and `name:` for a word with
   no arguments, for example `led.on:`. A name with no colon gives its value and
   does not call it. At the prompt, a word with no colon gives notice 102.
3. **A call takes every argument after its colon.** Put a call in parentheses
   when more arguments follow it: `max: (abs: -5), 3`. A call that is the last
   argument needs no parentheses: `print: abs: -42`.
4. **Compare integers with `=` and `<>`.** The other comparisons are `<`, `>`,
   `<=` and `>=`. `==` and `!=` give `invalid (8)`. Comparisons do not chain:
   write `1 < x and x < 3`. Compare Text with `text.equals?`. Test `nil` or a
   Bool with `if`, `when` or `unless`.
5. **Comments.** `--` starts a comment that ends at the line end. `-*` starts a
   block comment, and `*-` ends it.
6. **Line breaks.** Inside `[ ... ]`, a line break or a `;` ends an expression.
   At the top level, one line holds one form: `a is 1; b is 2` is an error.
7. **Integers only.** An integer is from -1073741824 to 1073741823. `3.14` gives
   `invalid (8)`. `0x68`, `0b101` and `1_000` work. There are no bit operators:
   `&`, `|`, `^`, `~`, `<<` and `>>` do not exist. The math operators are `+`,
   `-`, `*`, `/` and `%`, and the math words include `abs:`, `min:`, `max:`,
   `clamp:`, `map:`, `mod:`, `sqrt:` and `sign:`.
8. **Text.** Write Text in double quotes. The escapes are `\n`, `\r`, `\t`, `\"`,
   `\\` and `\xHH`. `+` does not join Text: write `text.concat: "a", "b"`.
   `print:` takes an integer, Text, Bytes or a buffer, and it adds no line
   end.
9. **Names.** `count is 0` binds a top-level name, and
   `set count to count + 1` changes it. `set` does not make a name. Inside a
   block, `v is 1` or `here v is 1` makes a local. A parameter cannot change.
10. **Control.** The forms are `if c [ ... ] else [ ... ]`, `when c [ ... ]`,
    `unless c [ ... ]`, `while c [ ... ]`, `repeat n [ ... ]`,
    `repeat n as i [ ... ]` (`i` counts from 0) and `forever [ ... ]`.
    `attempt [ ... ] rescue [ ... ]` catches an error. There is no `break`,
    `for` or `case`. Only `nil`, `false` and `0` are false.
11. **Values.** `scores is cells: 3` makes a Cells value. Read it with
    `scores[0]`, and change it with `set scores[0] to 7`.
    `record Point [ x, y ]` defines a record: `p is Point: 1, 2`, then `p->x`
    and `set p->y to 5`. `flash is fn [ led.toggle: ]` holds Code, and
    `flash:` runs it.
12. **No captured locals.** Code reads its own parameters and locals, and the
    top-level names. An event body cannot read the locals of the word that
    registered it.
13. **Events.** Register an event in a word: `every 1000 [ ... ]`,
    `after 500 [ ... ]`, `on pin falling debounce 25 [ ... ]` (also `rising` and
    `changes`), or `on wifi.disconnected [ ... ]` on a board with Wi-Fi. One word
    holds one event body. A board holds 16 event bindings. `cancel every 1000`,
    `cancel pin` and `cancel wifi.disconnected` remove them.
14. **Board constants start with `$`.** They are `$led_builtin`,
    `$led_active_level`, `$a0`, `$boot_button`, `$sda`, `$scl`, the `$baud_*`
    constants and the `$ble.*` constants. Do not invent others, such as
    `$button`. `$led_builtin` is `nil` on a board with no built-in LED, and the
    RP2040 boards have no `$boot_button`. For another pin, write its GPIO number.
15. **Save and boot.** `save` writes the words to flash. Only the prompt can run
    `save`, `restore` and `dangerous.wipe`; a word that calls them gives
    `prompt only (26)`. A word named `boot` runs when the board starts. `clear`
    removes the changes since the last `save`. `save` writes a handle as `nil`,
    and a top-level name cannot hold Bytes.

## Words That Do Not Exist

| Do not write | Write |
| --- | --- |
| `delay(100)`, `delay: 100`, `ms: 100` | `wait: 100` |
| `pinMode`, `digitalWrite`, `digitalRead` | `gpio.mode`, `gpio.write`, `gpio.read` |
| `analogRead`, `analogWrite` | `adc.read`, then `pwm.open` and `pwm.write` |
| `HIGH`, `LOW` | `1`, `0` |
| `OUTPUT`, `INPUT`, `INPUT_PULLUP` | modes `1`, `0` and `2` of `gpio.mode` |
| `Serial.println(x)` | `print.value: "x", x`, or `print: x` and then `print: "\n"` |
| `i2c.scan`, `spi.*` | nothing in v0.1.23 |
| `neopixel.show` | nothing; on ESP32 boards, the `pulse.*` words build a waveform |
| `break`, `return`, `for`, `case` | `while`, `repeat`, `forever`, `if` |
| `: name ... ;`, `DUP`, `SWAP` | Frothy has no data stack |

## Look Before You Write

The board answers questions. `words` lists the words on the board, and a word
that is not in the list does not exist there. `see name` prints the code of a
word. `status` prints the release and the profile, `mem` prints how full each
table is, and `events` prints the event bindings.

## Print A Number

`print:` writes an integer with no line end. `print.value:` writes a label, a
colon, an integer and a line end in one write, so an event cannot print inside
the line. Neither word makes a Text or Bytes value, so both are safe in a long
loop:

```frothy
repeat 20 [
  print.value: "a0", (adc.read: $a0)
  wait: 200
]
```

A label has 1 to 48 bytes: a letter or `_` first, then letters, digits, `_`,
`.` or `-`.

## Send Code

- The [browser editor](https://app.frothy.dev/editor) sends code with **Run
  Line** and **Run File**. `frothy send file.fr` sends a file, and
  `frothy connect` opens a prompt.
- The board reads one line of at most 511 bytes. The editor and the CLI send a
  form with line breaks as one line. A longer line gives
  `capacity exceeded (4)` and does not run.
- In another serial terminal, write each form on one line, and separate its
  expressions with `;`.
- Read the answer after each form. A success ends with `ok`. An error starts
  with `error: name (code)`, and `source:`, `note:` and other lines can follow.
  A notice starts with `notice:` and ends with `ok`.

## Common Errors

| Answer | Cause | Fix |
| --- | --- | --- |
| `not found (7)` | the name does not exist | check `words` and the spelling |
| `invalid (8)`, `unexpected token` | a syntax error | look for `!=`, a bit operator, or two forms on one line |
| `invalid (8)`, `expected ':' before the argument to a word` | a call with no colon | write `name: arg` |
| `invalid (8)`, `expected 3 arguments, got 1` | a call with the wrong number of arguments | give each argument; put a nested call in parentheses |
| `wrong type (2)` | a value of the wrong kind | for example, `text.concat:` with an integer |
| `capacity exceeded (4)` | a fixed table is full; the `note:` line names it | see [Limits](/limits/) |
| `busy (25)` | a pin or port is in use | close its handle first |
| `prompt only (26)` | a word called `save`, `restore` or `dangerous.wipe` | run it at the prompt |

## Limits

An ESP32 board holds 256 of your names, and an RP2040 board holds 192. About
4,178 bytes of compiled code and parameter names can wait for `save`, or 1,114
bytes on the XIAO ESP32C3. One form must fit in a 511-byte line and in 64 parse
nodes. A new Text value stays until the next `save`, `clear` or restart, so keep
a value that changes in a buffer. Each loop pass frees the Bytes values that it
made. [Limits](/limits/) lists every size.
