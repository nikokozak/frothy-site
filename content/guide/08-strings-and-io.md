---
title: "08. Text and I/O"
description: "Persistent Text, transient Bytes, the shared PAD, prompt output, and board I/O."
weight: 8
icon: message-circle
readTime: "8 min"
---

Frothy has `Text` values, but it does not pretend to be a desktop scripting
language. Text exists for names, messages, small payloads, simple parsing, and
board-facing protocols. File systems and rich Unicode text processing are not
part of the first public language surface.

## Text Values

A text literal is immutable:

```frothy
label is "ready"
label
```

Text is byte-oriented in the current implementation. Unicode semantics are out of
scope. That is a deliberate choice for a small device-first language.

Where text operations are available, they should be understood as byte
operations. A parser that looks at `"L68"` is looking at bytes, not grapheme
clusters or locale-sensitive characters.

## Transient Bytes

I/O words such as `http.get`, `tcp.read`, `i2c.read`, and BLE reads return
`Bytes`. Consume them during the current evaluation or loop iteration:

```frothy
to fetch-size with url [
  here body is http.get: url
  bytes.length: body
]
```

Bytes cannot be installed in top-level names, Cells, or record fields. Copy a
result into persistent Text when it must outlive the current call:

```frothy
body is text.pack: (http.get: "http://example.com/")
```

## Read A Console Line As Data

Normally, a line entered at the prompt is Frothy source. `console.read-line:`
lets a running form ask for one line as data instead:

```frothy
to echo-once [
  here line is console.read-line:
  print: line
  print: "\n"
]

echo-once:
```

The call blocks until you submit a line. Frothy removes its line ending and
returns the printable characters as volatile `Bytes`; it does not parse or run
them. A blank line returns empty Bytes. Ctrl-C interrupts the read.

In the browser editor, start the form, enter the data below Output in **Input
for console.read-line**, and choose **Send input**. The editor cannot tell which
word a running form is currently waiting in, so use that field only when your
code is blocked at `console.read-line:`. Use **Interrupt** for Ctrl-C.

Consume the result in the current evaluation, keep it in a `here` local during
one call, or copy it into persistent Text:

```frothy
answer is text.pack: console.read-line:
```

The word reads from the active human console, including a console moved with
`console.uart:`. It is for printable, line-oriented input. Use `uart.read-byte:`
and `uart.available:` for arbitrary bytes or an independent serial device.

## The Shared PAD

PAD is one 64-byte scratch buffer for building a short sequence one byte at a
time without allocating a Bytes value:

```frothy
pad.reset:
pad.emit-byte: 65
pad.emit-byte: 84
pad.type:
command is pad.pack:
```

`pad.pack` copies the current contents into persistent Text. Reset PAD before
building the next value. The [Text, Bytes & PAD module](/reference/modules/text-bytes-pad/)
lists the exact lifetime and capacity rules.

## Prompt Output

The prompt prints the result of top-level expression evaluation:

```frothy
"hello"
1 + 2
```

Definitions need not print a result:

```frothy
to hello [
  "hello"
]
```

Call the code when you want the value:

```frothy
hello:
```

For inspection, prefer the inspection words over improvised print debugging:

```frothy
see hello
```

That tells you what is bound, not just what a single expression happened to
return.

## Text In Small Parsers

Text is enough for compact local parsing exercises:

```frothy
to digit with byte [
  byte - 48
]
```

A full line parser usually keeps an index and accumulator in locals or
top-level state. Keep those helpers small. On a microcontroller, a readable
byte-at-a-time parser is usually better than hiding the work behind a large
general library.

## I/O Is Board Surface

Frothy separates language values from board I/O. GPIO, ADC, display, I2C, UART,
and timing are base-image or board-provided bindings:

```frothy
gpio.read: $boot_button
adc.read: $a0
aux is uart.open: 1, $baud_115200
uart.write-byte: aux, 65
```

Not every board or firmware composition exposes every I/O family. The full
`esp32_plain` profile carries the complete module surface, while board pin maps
and optional capabilities still vary. Run `words` against the device in front
of you when availability matters.

That split keeps examples honest. A tutorial can be device-first without
implying that every board has every peripheral.

Next: [Talking to hardware](/guide/09-talking-to-hardware/).
