---
title: "UART"
weight: 8
url: /reference/modules/uart/
aliases:
  - /reference/hardware/uart/
description: "Open an auxiliary serial port, exchange bytes, check availability, and close its handle."
icon: cable
tags: [uart, serial, bytes]
---

Auxiliary UARTs connect Frothy to GPS receivers, modems, motor controllers, and
other byte-oriented serial devices. They are separate from the active human
console that carries the REPL.

## Send And Receive One Byte

```frothy
aux is uart.open-on: 1, 17, 16, $baud_115200
uart.write-byte: aux, 65

when (uart.available: aux) > 0 [
  uart.read-byte: aux
]

uart.close: aux
set aux to nil
```

`65` is ASCII `A`. UART words work with individual integers from `0` through
`255`; build a loop when a protocol has a longer frame.

## Word Table

| Word | Result | Use |
| --- | --- | --- |
| [`uart.open`](/reference/words/#uart-open) | `Handle` | Open a port on its target-default pins |
| [`uart.open-on`](/reference/words/#uart-open-on) | `Handle` | Open a port on explicit TX and RX pins |
| [`uart.available`](/reference/words/#uart-available) | `Int` | Count bytes ready to read without waiting |
| [`uart.read-byte`](/reference/words/#uart-read-byte) | `Int` | Read one byte, or `-1` when none is ready |
| [`uart.write-byte`](/reference/words/#uart-write-byte) | `nil` | Write one byte |
| [`uart.close`](/reference/words/#uart-close) | `nil` | Close the port and release its handle |

## Baud Constants

Use one of the named baud values:

| Constant | Baud |
| --- | ---: |
| [`$baud_1200`](/reference/words/#baud-1200) | 1200 |
| [`$baud_9600`](/reference/words/#baud-9600) | 9600 |
| [`$baud_19200`](/reference/words/#baud-19200) | 19200 |
| [`$baud_38400`](/reference/words/#baud-38400) | 38400 |
| [`$baud_57600`](/reference/words/#baud-57600) | 57600 |
| [`$baud_115200`](/reference/words/#baud-115200) | 115200 |

```frothy
aux is uart.open: 1, $baud_9600
```

`uart.open` uses the port's target-default pins. Use `uart.open-on` when the
board exposes a different route. The chosen port and pins must be supported and
must not conflict with the active console or another peripheral.

## Exclusive Ports And Busy Errors

A UART port has one owner. Opening a valid port that is already claimed reports
the rejected port in a `busy` error:

```text
error: busy: 0 (25)
detail: uart.open argument 1 was rejected
```

Reuse the existing handle, close that handle before opening the port again, or
select a different supported port. Code 25 is distinct from a bad port number:
it means the resource exists but is currently exclusive to another owner. See
[Error and notice codes](/errors/#code-25) for the general recovery contract.

## Nonblocking Reads

`uart.read-byte` does not wait forever. It returns the next byte or `-1` when
the receive queue is empty:

```frothy
to drain-uart handle [
  while (uart.available: handle) > 0 [
    print: (text.from-int: uart.read-byte: handle)
  ]
]
```

Check `uart.available` when `-1` would overlap an application sentinel. Read
bytes are unsigned `0..255` integers.

## Auxiliary Port Or Console?

Use `uart.*` for application data while the REPL remains on its current route.
Use [Console routing](/reference/modules/console/) only when you intentionally
want the prompt and all console output to move to another UART.

UART handles are volatile. Close them, replace top-level handle bindings, and
reopen required ports from `boot` before using `save` and `restore`. If a
top-level UART handle remains, a bare `save` or `save:` prompt form produces a
nonfatal [`not saved (13)` notice](/errors/#code-13); the live session
continues, but the durable image is not replaced. A save inside a larger form
is an error instead.
