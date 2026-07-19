---
title: "Events"
weight: 4
url: /reference/modules/events/
description: "Run timer, GPIO-edge, and Wi-Fi lifecycle handlers at safe points without blocking the prompt."
icon: bell-ring
tags: [events, timers, gpio, wifi]
---

Events let the device react later while the prompt stays available. Frothy
records a small handler, receives timer or hardware candidates, and runs the
handler at a safe statement boundary.

## Timers And A Button

Event registration belongs inside a word:

```frothy
to start-events [
  every 1000 [ print: "tick\n" ]
  after 10000 [ led.off: ]
  on $boot_button falling debounce 25 [
    led.toggle:
  ]
]

start-events:
```

`every` repeats. `after` removes itself before its body runs. The GPIO handler
can use `rising`, `falling`, or `changes`; `debounce` is optional.

## Event Forms

| Form | Identity | Behavior |
| --- | --- | --- |
| [`every ms [body]`](/reference/words/#every) | kind plus millisecond value | Repeats until cancelled or cleared |
| [`after ms [body]`](/reference/words/#after) | kind plus millisecond value | Runs once, then disappears |
| [`on pin edge [body]`](/reference/words/#on) | GPIO pin | Runs on the selected edge |
| [`on pin edge debounce ms [body]`](/reference/words/#on) | GPIO pin | Drops candidates inside the debounce window |
| [`on wifi.disconnected [body]`](/reference/words/#on) | Wi-Fi state | Runs after a previously working connection drops |
| [`on wifi.reconnected [body]`](/reference/words/#on) | Wi-Fi state | Runs when that connection returns |
| [`cancel ...`](/reference/words/#cancel) | matching source identity | Removes one registration |

## Cancel And Replace

Use the same identity used at registration:

```frothy
cancel every 1000
cancel after 10000
cancel $boot_button
cancel wifi.disconnected
cancel wifi.reconnected
```

Timer identity includes both kind and period, so `every 1000` and `after 1000`
are different registrations. GPIO identity is the pin alone: registering a new
edge handler for the same pin replaces the old one, and `cancel pin` removes it
regardless of edge or debounce. Each Wi-Fi lifecycle kind has one binding.

The current runtime holds 16 event bindings in total. Re-registering a matching
identity replaces it without consuming another slot. `mem events` shows used
and total capacity; `events` lists the active registrations.

## Handler Scope

Event bodies do not capture the parameters or `here` locals of the word that
registered them. Use top-level names or call another top-level word:

```frothy
presses is 0

to count-press [
  set presses to presses + 1
]

to arm-button [
  on $boot_button falling debounce 25 [ count-press: ]
]
```

This keeps a handler valid after the registration call has returned.

## Dispatch And Output

Candidates arrive asynchronously, but handler code runs in the Frothy runtime
at safe points: statement boundaries, loop back-edges, and word returns. A long
single expression can delay delivery until the next such point. Handlers do not
interrupt one another recursively.

Output produced outside the foreground reply is prefixed with `! ` on the wire:

```text
! tick
```

If the platform queue overflows, Frothy reports `! events dropped: N`. Keep
handlers short and move sustained work into ordinary foreground code when
possible.

## Wi-Fi Lifecycle

Register Wi-Fi handlers before connecting:

```frothy
to network-events [
  on wifi.disconnected [ print: "wifi down\n" ]
  on wifi.reconnected [ print: "wifi back\n" ]
]

network-events:
wifi.connect:
```

The first successful connection is not a `wifi.reconnected` event. These forms
describe a drop and recovery after the device has already obtained an address.
See [Wi-Fi, HTTP & TCP](/reference/modules/wifi/) for connection behavior.

## Persistence And Clearing

Event registrations are part of the project overlay. `save` persists them,
`restore` reinstalls them, and `clear` or a project wipe removes their live
platform registrations. Use `events` after restore to inspect what is active.

Timers and GPIO handlers are for human-scale asynchronous work. For captured or
emitted edges with 100-nanosecond quantization, use [Digital
signals](/reference/modules/signals/).
