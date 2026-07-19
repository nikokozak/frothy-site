---
title: "Console Routing"
weight: 13
url: /reference/modules/console/
description: "Inspect the active human console, move the REPL to UART pins, and restore the board's recovery route."
icon: terminal
tags: [console, uart, repl, recovery]
---

The console is the transport carrying prompt input, replies, asynchronous event
output, and recovery. Console routing moves that whole conversation; it does
not open an auxiliary application UART handle.

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

- Use `console.*` when a human or host tool should move with the REPL.
- Use [`uart.*`](/reference/modules/uart/) for application bytes while the
  human console stays where it is.

Do not assign the active console's port or pins to an auxiliary UART at the same
time. A bad route can make a healthy device look silent, so verify the pins,
voltage level, baud, and terminal connection before moving it. If the new route
is unreachable, reboot into the board's safe/default recovery path and avoid
persisting the bad routing call in `boot` until it has been tested.
