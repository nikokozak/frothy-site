---
title: "UART"
weight: 10
description: "Auxiliary UART handles and console-routing words for boards that expose them."
advanced: true
---

UART is a source-board peripheral surface. It is for serial devices and, on
some boards, explicit console routing. It is not part of the beginner Froth
Machine path.

## Availability

The `esp32-devkit-v1` board source exposes auxiliary UART bindings. The active
console itself is still special: it carries REPL input, output, and host
attachment.

## Auxiliary UART

**`uart.init:`** `(tx, rx, baud) -> Int`

Creates an auxiliary UART handle.

```froth
aux is uart.init: UART_TX, UART_RX, 115200
```

**`uart.write:`** `(byte, uart) -> nil`

Writes one byte.

```froth
uart.write: 65, aux
```

**`uart.read:`** `(uart) -> Int`

Reads one byte.

```froth
uart.read: aux
```

**`uart.key?:`** `(uart) -> Bool`

Returns true when at least one byte is waiting.

```froth
when uart.key?: aux [
  uart.read: aux
]
```

## Console Routing

Boards that support console routing expose words for the active REPL transport:

**`console.info:`** `() -> nil`

Reports the current console route.

**`console.default:`** `() -> nil`

Returns the console to its default route.

**`console.uart!:`** `(port, tx, rx, baud) -> nil`

Moves the console to a selected UART route.

Use console-routing words carefully. If you move the REPL away from the host
connection you are using, you can make the board appear unresponsive until you
attach through the new route or reset to a safe state.
