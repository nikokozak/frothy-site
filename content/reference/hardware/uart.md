---
title: "UART"
weight: 10
description: "Auxiliary UART handles for boards that expose them."
advanced: true
---

UART is a ESP32 peripheral surface. It is for serial devices. It is not part of
the beginner Frothy path.

## Availability

The `esp32_devkit_v1` board source exposes auxiliary UART bindings. The active
console itself is still special: it carries REPL input, output, and host
attachment.

Baud rates are named special vars: `$baud_9600`, `$baud_19200`, `$baud_38400`,
`$baud_57600`, and `$baud_115200`.

## Auxiliary UART

**`uart.open:`** *(uart)* `(port, baud) -> Int`

Opens an auxiliary UART on a port at a baud rate and returns a handle.

```frothy
aux is uart.open: 1, $baud_115200
```

**`uart.open-on:`** *(uart)* `(port, tx, rx, baud) -> Int`

Opens an auxiliary UART on a port with explicit TX and RX pins.

```frothy
aux is uart.open-on: 1, 17, 16, $baud_115200
```

**`uart.write-byte:`** *(uart)* `(handle, byte) -> nil`

Writes one byte.

```frothy
uart.write-byte: aux, 65
```

**`uart.read-byte:`** *(uart)* `(handle) -> Int`

Reads one byte.

```frothy
uart.read-byte: aux
```

**`uart.available:`** *(uart)* `(handle) -> Int`

Returns the count of bytes waiting to be read.

```frothy
when (uart.available: aux) > 0 [
  uart.read-byte: aux
]
```

**`uart.close:`** *(uart)* `(handle) -> nil`

Closes the UART and releases the handle.

```frothy
uart.close: aux
```
