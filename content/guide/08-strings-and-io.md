---
title: "08. Text and I/O"
description: "Text literals, byte-oriented indexing, prompt output, and the split between language values and board I/O."
weight: 8
---

Froth has `Text` values, but it does not pretend to be a desktop scripting
language. Text exists for names, messages, small payloads, simple parsing, and
board-facing protocols. File systems and rich Unicode text processing are not
part of the first public language surface.

## Text Values

A text literal is immutable:

```froth
label is "ready"
label
```

Text is byte-oriented in the current profile. Unicode semantics are out of
scope. That is a deliberate choice for a small device-first language.

Where text operations are available, they should be understood as byte
operations. A parser that looks at `"L68"` is looking at bytes, not grapheme
clusters or locale-sensitive characters.

## Prompt Output

The prompt prints the result of top-level expression evaluation:

```froth
"hello"
1 + 2
```

Definitions need not print a result:

```froth
to hello [
  "hello"
]
```

Call the code when you want the value:

```froth
hello:
```

For inspection, prefer the inspection words over improvised print debugging:

```froth
show @hello
see @hello
info @hello
```

Those tell you what is bound, not just what a single expression happened to
return.

## Text In Small Parsers

Text is enough for compact local parsing exercises:

```froth
to digit with byte [
  byte - 48
]
```

A full line parser usually keeps an index and accumulator in locals or
top-level state. Keep those helpers small. On a microcontroller, a readable
byte-at-a-time parser is usually better than hiding the work behind a large
general library.

## I/O Is Board Surface

Froth separates language values from board I/O. GPIO, ADC, display, I2C, UART,
and timing are base-image or board-provided bindings:

```froth
gpio.read: BOOT_BUTTON
adc.read: A0
grid.show:
uart.write: 65, console
```

Not every board exposes every I/O family. The Froth Machine exposes GPIO, ADC,
the TM1629 display layer, joystick helpers, and knob helpers. The source-level
ESP32 DevKit V1 board also carries I2C, UART, and LEDC bindings.

That split keeps examples honest. A tutorial can be device-first without
implying that every board has every peripheral.

Next: [Talking to hardware](/guide/09-talking-to-hardware/).
