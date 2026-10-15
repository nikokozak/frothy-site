---
title: "Text, Bytes & PAD"
weight: 6
url: /reference/modules/text-bytes-pad/
description: "Choose Text for fixed strings, Bytes for working bytes, a buffer for a value that changes, or the 64-byte PAD."
icon: binary
tags: [text, bytes, pad, data]
---

Frothy has four byte tools with different lifetimes:

| Kind | Best for | Lifetime |
| --- | --- | --- |
| `Text` | fixed strings and copied I/O results | object value; persistable |
| `Bytes` | live I/O and temporary binary transforms | current evaluation or loop pass |
| buffer | a value that changes many times | fixed capacity; persistable |
| PAD | one tiny hand-built scratch sequence | one shared 64-byte area until reset |

Each new Text value stays until the next `save`, `clear` or restart. Keep a
value that changes in a buffer. Show a number with `print:` or `print.value:`;
they make no Text value.

## Copy An HTTP Body Into Text

An I/O read returns `Bytes`. It cannot be installed in a top-level binding:

```frothy
body is text.pack: (http.get: "http://example.com/")
text.length: body
```

Inside a word, a `here` local can hold Bytes for the duration of the call:

```frothy
to fetch-size with url [
  here body is http.get: url
  bytes.length: body
]
```

## Keep The Latest HTTP Body In A Buffer

A program that fetches a reply again and again keeps it in a buffer.
`text.pack` makes a new Text value when no equal Text value exists.
`buffer.set` writes into the same storage:

```frothy
reply is buffer: 512

to fetch with url [
  buffer.set: reply, (http.get: url)
]
```

A body longer than 512 bytes answers `capacity exceeded (4)`, and `reply` keeps
the body before it.

## Text

| Word | Result | Use |
| --- | --- | --- |
| [`text.length`](/reference/words/#text-length) | `Int` | Byte length |
| [`text.equals?`](/reference/words/#text-equals) | `Bool` | Byte-for-byte equality |
| [`text.concat`](/reference/words/#text-concat) | `Text` | New joined Text |
| [`text.at`](/reference/words/#text-at) | `Int` | Byte at an index |
| [`text.from-int`](/reference/words/#text-from-int) | `Text` | Decimal integer rendering |
| [`text.pack`](/reference/words/#text-pack) | `Text` | Copy Bytes into Text storage |

Text is immutable and indexed by byte, not Unicode character. Source literals
support `\n`, `\r`, `\t`, `\"`, `\\`, and `\xHH` for one byte in hexadecimal. One
Text value holds at most 4,096 bytes. The Text values made since the last
`save` and the capacities of all buffers share a RAM pool of 4,096 bytes. Text
shares the object table with Cells, records and buffers: 128 entries on ESP32
boards and 96 on RP2040 boards.

```frothy
greeting is text.concat: "hello, ", "Frothy"
text.at: greeting, 0
text.equals?: greeting, "hello, Frothy"
```

Each new Text value uses an object entry and room in the Text pool until the
next `save`, `clear`, or restart, also when the program does not keep it. Reuse
stable values. In a long loop, print a number with `print:` or `print.value:`.
They make no Text value.

## Bytes

| Word | Result | Use |
| --- | --- | --- |
| [`bytes.from-text`](/reference/words/#bytes-from-text) | `Bytes` | Copy Text into the transient arena |
| [`bytes.from-byte`](/reference/words/#bytes-from-byte) | `Bytes` | Create one byte from `0..255` |
| [`bytes.from-int`](/reference/words/#bytes-from-int) | `Bytes` | Decimal integer as ASCII bytes |
| [`bytes.length`](/reference/words/#bytes-length) | `Int` | Byte count |
| [`bytes.at`](/reference/words/#bytes-at) | `Int` | Byte at an index |
| [`bytes.equals?`](/reference/words/#bytes-equals) | `Bool` | Byte-for-byte equality |
| [`bytes.concat`](/reference/words/#bytes-concat) | `Bytes` | Join two Bytes values |
| [`console.read-line`](/reference/words/#console-read-line) | `Bytes` | Read one printable console line as data |

Eight Bytes values can be in use at one time, with 4,096 bytes of data in
total. Each pass of `repeat`, `while`, and `forever` frees the Bytes values that
the pass made. An event body and a failed `attempt` body free theirs when they
end, and the prompt frees all Bytes values after each form. So a loop can make
Bytes values for as long as it runs.

A Bytes value cannot stay from one pass to the next. `set` of a local refuses a
Bytes value with `not saved (13)`. The next pass can free the value while the
local still names it. Make the value with `here` in the loop body.

Bytes cannot be written to top-level slots, Cells, or record fields, and cannot
be saved. Consume them immediately, keep them in a `here` local during one
call, or pack them:

```frothy
to make-frame [
  here head is bytes.from-text: "value="
  here value is bytes.from-int: 42
  here frame is bytes.concat: head, value
  text.pack: frame
]

frame-text is make-frame:
```

Words such as `print`, `i2c.write`, `tcp.write`, and BLE write operations accept
Text, Bytes or a buffer directly. `console.read-line`, `i2c.read`, `tcp.read`, `http.get`,
and BLE read operations return Bytes.

## Buffers

| Word | Result | Use |
| --- | --- | --- |
| [`buffer.set`](/reference/words/#buffer-set) | `nil` | Replace the contents |
| [`buffer.append`](/reference/words/#buffer-append) | `nil` | Add bytes after the contents |
| [`buffer.length`](/reference/words/#buffer-length) | `Int` | Byte count |
| [`buffer.capacity`](/reference/words/#buffer-capacity) | `Int` | Most bytes it can hold |
| [`buffer.at`](/reference/words/#buffer-at) | `Int` | Byte at an index |
| [`buffer.equals?`](/reference/words/#buffer-equals) | `Bool` | Byte-for-byte equality |

`name is buffer: N` makes a buffer at the top level. Its capacity uses the RAM
Text pool. `mem objects` shows the total capacity of the buffers in the row
`objects.buffers.used`.
[Buffers](/reference/language/#buffers) gives the rules.

## PAD

PAD is one global scratch area. It is useful when bytes are assembled one at
a time without allocating a Bytes entry:

```frothy
pad.reset:
pad.emit-byte: 65
pad.emit-byte: 84
pad.type:
command is pad.pack:
```

| Word | Result | Use |
| --- | --- | --- |
| [`pad.reset`](/reference/words/#pad-reset) | `nil` | Empty the PAD |
| [`pad.emit-byte`](/reference/words/#pad-emit-byte) | `nil` | Append one `0..255` byte |
| [`pad.length`](/reference/words/#pad-length) | `Int` | Current byte count |
| [`pad.peek-byte`](/reference/words/#pad-peek-byte) | `Int` | Read one byte by index |
| [`pad.type`](/reference/words/#pad-type) | `nil` | Write PAD bytes to the console |
| [`pad.pack`](/reference/words/#pad-pack) | `Text` | Copy PAD into persistent Text |

The current PAD holds 64 bytes. `pad.emit-byte` reports capacity when full;
`pad.peek-byte` reports range for an invalid index. `pad.pack` does not clear
the PAD, so call `pad.reset` before constructing the next value.
