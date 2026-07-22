---
title: "Text, Bytes & PAD"
weight: 6
url: /reference/modules/text-bytes-pad/
description: "Choose persistent Text, evaluation-scoped Bytes, or the single 64-byte PAD scratch buffer."
icon: binary
tags: [text, bytes, pad, data]
---

Frothy has three byte-oriented tools with deliberately different lifetimes:

| Kind | Best for | Lifetime in the ESP32 plain profile |
| --- | --- | --- |
| `Text` | durable strings and copied I/O results | object value; persistable |
| `Bytes` | live I/O and temporary binary transforms | current evaluation or loop iteration |
| PAD | one tiny hand-built scratch sequence | one shared 64-byte buffer until reset |

Choose the shortest lifetime that fits, and cross into Text explicitly with
`text.pack` or `pad.pack` when data must persist.

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
support `\n`, `\r`, `\t`, `\"`, and `\\`. In the ESP32 plain profile, one Text
value is limited to 4096 bytes and the text pool holds 8192 bytes in total.

```frothy
greeting is text.concat: "hello, ", "Frothy"
text.at: greeting, 0
text.equals?: greeting, "hello, Frothy"
```

Creating unique Text consumes the bounded text pool. Reuse stable values and
use transient Bytes for working I/O rather than packing every intermediate.

## Bytes

| Word | Result | Use |
| --- | --- | --- |
| [`bytes.from-text`](/reference/words/#bytes-from-text) | `Bytes` | Copy Text into the transient arena |
| [`bytes.from-byte`](/reference/words/#bytes-from-byte) | `Bytes` | Create one byte from `0..255` |
| [`bytes.from-int`](/reference/words/#bytes-from-int) | `Bytes` | Decimal integer as ASCII bytes |
| [`bytes.length`](/reference/words/#bytes-length) | `Int` | Buffer length |
| [`bytes.at`](/reference/words/#bytes-at) | `Int` | Byte at an index |
| [`bytes.equals?`](/reference/words/#bytes-equals) | `Bool` | Byte-for-byte equality |
| [`bytes.concat`](/reference/words/#bytes-concat) | `Bytes` | Join two transient buffers |
| [`console.read-line`](/reference/words/#console-read-line) | `Bytes` | Read one printable console line as data |

The ESP32 plain runtime provides eight Bytes entries backed by a 4096-byte
arena. A buffer is reset at the end of the outer prompt evaluation, after boot,
and at loop back-edges. Do not carry one across iterations.

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
Text or Bytes directly. `console.read-line`, `i2c.read`, `tcp.read`, `http.get`,
and BLE read operations return Bytes.

## PAD

PAD is one global scratch buffer. It is useful when bytes are assembled one at
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
