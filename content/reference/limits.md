---
title: "Limits"
weight: 3
url: /limits/
aliases:
  - /reference/limits/
description: "The fixed sizes of a Frothy board, and what to do when one is full."
icon: gauge
tags: [limits, capacity, memory, errors]
guideTopic: true
---

A Frothy board keeps your program in tables of fixed size. When a table is
full, the board stops the form with error 4. A `note:` line names the table and
its size:

```text
error: capacity exceeded (4)
note: pending code is full (limit 4178 bytes) -- a save that succeeds frees it
```

The numbers on this page are for Frothy v0.1.23. All ESP32 boards have the same
limits, except the code area of the XIAO ESP32C3. The two RP2040 boards have the
same limits. `mem` shows how much of each table is in use.

| What | ESP32 boards | RP2040 boards |
| --- | --- | --- |
| Names that you define, saved or not | 256 | 192 |
| Compiled code and parameter names that wait for `save` | 4,178 bytes (1,114 on the XIAO ESP32C3) | 4,178 bytes |
| One line | 511 bytes | 511 bytes |
| Parse nodes in one form | 64 | 64 |
| Object table entries (Text, Cells, records, buffers) | 128 | 96 |
| Text and buffers in use | 4,096 bytes | 4,096 bytes |
| Cells in use | 128 | 128 |
| Elements in one Cells value | 32 | 32 |
| Fields in one record | 4 | 4 |
| Open handles | 16 | 12 |
| Event bindings | 16 | 16 |
| Bytes values in use | 8 | 8 |
| PAD | 64 bytes | 64 bytes |
| Parameters in one word | 8 | 8 |
| Locals in one word, with one for each loop level | 16 | 16 |
| Expressions in one block | 24 | 24 |
| Levels of parentheses | 15 | 15 |
| Nested calls | 24 | 24 |
| Bytes in one name | 48 | 48 |
| Integers | -1,073,741,824 to 1,073,741,823 | the same |

`save` does not free a name. `clear` removes the names that you did not save.
`wipe-user` removes all of your names and your saved program. The
[network words](/reference/modules/wifi/) have their own limits.

## Code That Waits For `save`

Each definition adds its compiled code and its parameter names to an area of
4,178 bytes, or 1,114 bytes on the XIAO ESP32C3. The code stays there until
`save` moves it into the saved image. When you define a word again, the board
adds the new code, and the old code also stays until `save`.

This word uses 51 bytes. On most boards, 81 definitions of it fit, and the 82nd
fails. On the XIAO ESP32C3, the 22nd definition fails:

```frothy
to pulse with pin [ gpio.write: pin, 1; gpio.write: pin, 0; gpio.write: pin, 1; gpio.write: pin, 0 ]
```

When the area is full, type `save`. Then send your definitions again, from the
one that failed. In a long file, put a `save` line after each group of words.
`mem code` shows how much of the area is in use.

## Long Words

The board reads at most 511 bytes in one line. The editor and `frothy send`
send each form, for example one `to` definition, as one line. In a form with
line breaks, each line break and each backslash count as 2 bytes, and the tools
add 12 bytes. Indentation also counts. The board does not run a line that is too long:

```text
error: capacity exceeded (4)
note: the line limit is 511 bytes
```

A form must also fit in 64 parse nodes. A word with 20 calls such as
`gpio.write: pin, 1` fits, and a word with 21 of these calls does not. Split a
long word into smaller words, and let one word call the next.

## Text And Bytes In A Loop

Each new Text value uses one entry of the object table. The entry stays in use
until the next `save`, `clear` or restart, also when your program does not keep
the value. This loop stops after 128 values on an ESP32 board, and after 96
values on an RP2040 board:

```frothy
repeat 200 as i [ text.from-int: i ]
```

```text
error: capacity exceeded (4)
note: object table is full (limit 128)
```

To print numbers in a loop, use `print:` or `print.value:`. They make no Text
value. To keep a value that changes, such as the latest reply, use a
[buffer](/reference/language/#buffers).

Bytes values do not fill a table in a loop. Each pass of `repeat`, `while` and
`forever` frees the Bytes values that the pass made. So a loop that calls
`i2c.read` or `http.get` can run for as long as you want. At one time, 8 Bytes
values with 4,096 bytes of data in total can be in use.

Each loop level uses one of the 16 locals of its word. A word with 16 locals
and a loop answers `capacity exceeded (4)` with the note
`space for locals in one form is full (limit 16)`.
