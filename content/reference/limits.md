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
note: pending code is full (limit 687 bytes) -- a save that succeeds frees it
```

The numbers on this page are for Frothy v0.1.22. All ESP32 boards have the same
limits, and the two RP2040 boards have the same limits. `mem` shows how much of
each table is in use.

| What | ESP32 boards | RP2040 boards |
| --- | --- | --- |
| Names that you define, saved or not | 256 | 192 |
| Compiled code that waits for `save` | 687 bytes | 687 bytes |
| One line | 511 bytes | 511 bytes |
| Parse nodes in one form | 64 | 64 |
| Object table entries (Text, Cells, records) | 128 | 96 |
| Text in use | 4,096 bytes | 4,096 bytes |
| Cells in use | 128 | 128 |
| Elements in one Cells value | 32 | 32 |
| Fields in one record | 4 | 4 |
| Open handles | 16 | 12 |
| Event bindings | 16 | 16 |
| Bytes values in use | 8 | 8 |
| New Bytes values after a restart | 1,024 | 1,024 |
| PAD | 64 bytes | 64 bytes |
| Parameters in one word | 8 | 8 |
| Locals in one word | 16 | 16 |
| Expressions in one block | 24 | 24 |
| Levels of parentheses | 15 | 15 |
| Nested calls | 24 | 24 |
| Bytes in one name | 48 | 48 |
| Integers | -1,073,741,824 to 1,073,741,823 | the same |

`save` does not free a name. `clear` removes the names that you did not save.
`wipe-user` removes all of your names and your saved program. The
[network words](/reference/modules/wifi/) have their own limits.

## Code That Waits For `save`

Each definition adds its compiled code to an area of 687 bytes. The code stays
there until `save` moves it into the saved image. When you define a word again,
the board adds the new code, and the old code also stays until `save`.

This word uses 47 bytes. Define it 15 times, and the 15th definition fails:

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
note: object table (cells, text and records) is full (limit 128)
```

To print numbers in a loop, use the `print-int` word from
[Coming from Arduino](/coming-from-arduino/#numbers). It uses the PAD, not the
object table.

After a restart, a board can make 1,024 Bytes values. After that, each word
that returns Bytes fails with `note: Bytes table is full (limit 8)`, also when
no Bytes value is in use. `save`, `clear`, `wipe-user` and a restart reset the
count. The words that return Bytes include `i2c.read`, `console.read-line`,
`http.get` and `bytes.from-int`.

A loop that calls `i2c.read` ten times each second stops after about 100
seconds. To read a sensor register in a loop, use `i2c.read-reg` or
`i2c.read-reg16`. They return an integer, not Bytes.
