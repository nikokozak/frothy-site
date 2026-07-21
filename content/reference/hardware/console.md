---
title: "Console Input & Routing"
weight: 13
url: /reference/modules/console/
description: "Read a line as data, inspect the active human console, move the REPL to UART pins, and restore its recovery route."
icon: terminal
tags: [console, input, uart, repl, recovery]
---

The console is the transport carrying prompt input, replies, asynchronous event
output, and recovery. Console routing moves that whole conversation; it does
not open an auxiliary application UART handle.

## Read Input As Data

`console.read-line:` blocks a running form until one line arrives on the active
console. It removes the line ending and returns the printable characters as
volatile `Bytes` instead of interpreting them as source:

```frothy
to echo-once [
  here line is console.read-line:
  print: line
  print: "\n"
]
```

A blank line returns empty Bytes. Ctrl-C interrupts the read. Consume the value
in the current evaluation or copy it into persistent Text:

```frothy
answer is text.pack: console.read-line:
```

In the browser editor, run the form and submit data through **Input for
console.read-line** below Output. The editor cannot detect which word a running
form is waiting in, so use that field only while the form is blocked at
`console.read-line:`.

## Inspect And Move The Console

```frothy
console.info:
console.uart: 17, 16, 115200
```

After `console.uart` succeeds, the next reply and all later input/output use the
selected route. Reconnect your terminal to those pins at that literal baud
rate. The baud argument is the number itself, not a `$baud_*` UART code.

| Word | Result | Use |
| --- | --- | --- |
| [`console.read-line`](/reference/words/#console-read-line) | `Bytes` | Read one printable console line as data |
| [`console.info`](/reference/words/#console-info) | `nil` | Print the current host, USB, or UART route |
| [`console.uart`](/reference/words/#console-uart) | `nil` | Move to explicit TX, RX, and baud |
| [`console.default`](/reference/words/#console-default) | `nil` | Restore the board's boot/recovery console |

`console.info` prints a line such as:

```text
console uart tx=17 rx=16 baud=115200
```

## Return To The Default

From the currently active route:

```frothy
console.default:
```

The reply moves with the route change. The board's default console is the route
used at boot and for recovery; its physical transport depends on the board.

## Console Versus Auxiliary UART

- Use `console.read-line` for printable input from the human/host REPL route.
- Use the routing words when a human or host tool should move with the REPL.
- Use [`uart.*`](/reference/modules/uart/) for application bytes while the
  human console stays where it is.

Do not assign the active console's port or pins to an auxiliary UART at the same
time. A bad route can make a healthy device look silent, so verify the pins,
voltage level, baud, and terminal connection before moving it. If the new route
is unreachable, reboot into the board's safe/default recovery path and avoid
persisting the bad routing call in `boot` until it has been tested.
