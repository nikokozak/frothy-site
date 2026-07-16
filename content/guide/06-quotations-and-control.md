---
title: "06. Blocks and Control Flow"
description: "Use blocks to choose, repeat, loop forever, and react to events."
weight: 6
aliases:
  - /guide/04-control-flow-cells-and-records/
icon: repeat-2
readTime: "7 min"
---

Frothy keeps code as a value, but the syntax is lexical and direct.

The most important rule is simple: a block creates a scope and yields the value
of its last expression.

```frothy
to nextSpeed with speed [
  here candidate is speed + 10;
  clamp: candidate, 0, 100
]
```

The block's final expression is the call to `clamp`. That is the function's
result.

## `if`, `when`, and `unless`

Only `nil`, `false`, and `0` take the false branch. Every other value is
truthy.

```frothy
to led.byKnob with percent [
  if percent > 50 [
    led.on:
  ] else [
    led.off:
  ]
]
```

Truthiness is handy for compact checks, but predicates and comparisons usually
make device behavior easier to scan.

Use `when` for a one-sided action:

```frothy
when (gpio.read: $boot_button) == 0 [
  led.toggle:
]
```

Use `unless` when the negative condition reads better:

```frothy
unless (gpio.read: $boot_button) == 0 [
  led.off:
]
```

If an `if` has no `else` and the condition is false, it yields `nil`.

## `while`

`while` evaluates the condition before each iteration:

```frothy
to waitForPress [
  while (gpio.read: $boot_button) == 1 [
    ms: 20
  ]
]
```

The body value is discarded. Use locals or top-level state for values you need
after the loop.

## `repeat`

Use `repeat` for counted loops:

```frothy
to blink.times with count, wait [
  repeat count [
    led.on:;
    ms: wait;
    led.off:;
    ms: wait
  ]
]
```

Use `repeat ... as name` when the loop index matters:

```frothy
to countUp [
  repeat 4 as i [
    led.blink: i + 1, 30
  ]
]
```

The index is a local for that iteration's body.

## `forever`

Use `forever` when the device should keep doing one small job until you
interrupt it:

```frothy
to beacon [
  forever [
    led.toggle:;
    ms: 250
  ]
]
```

Run `beacon:` and press Ctrl-C when you want it to stop. The loop also stops if
its body raises an error.

## Let The Device React

Events let a device keep working after the prompt returns:

```frothy
to heartbeat.start [
  every 1000 [ led.toggle: ]
]

to heartbeat.stop [
  cancel every 1000
]
```

Call `heartbeat.start:` once. Frothy registers the timer and gives the prompt
back; the event body runs once per second. `after` is the one-shot version.

GPIO events use the same shape:

```frothy
to button.listen with pin [
  on pin falling debounce 30 [ led.toggle: ]
]

to button.ignore with pin [
  cancel pin
]
```

Register events inside a definition body. Timer cancellation repeats the timer
kind and delay; GPIO cancellation names the pin. Event bodies run
cooperatively at statement-boundary safe points, not inside the hardware
interrupt handler.

## `Code` As A Value

Use `fn` when a top-level name should hold executable behavior:

```frothy
flash is fn [
  led.blink: 1, 50
]

flash:
```

A bare `flash` reads the `Code` value without running it. `flash:` runs the code
held in that named top-level slot. Calls do not currently accept an arbitrary
expression as the callee.

Blocks now give you three useful scales of control: finish a calculation now,
loop until a job is done, or register code for the device to run later.

Next: [Errors and recovery](/guide/07-error-handling/).
