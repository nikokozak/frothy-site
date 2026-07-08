---
title: "06. Blocks and Control Flow"
description: "Use blocks as lexical scopes and Code values; choose, repeat, and loop with explicit booleans."
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

Conditions must be `Bool`. Frothy does not treat arbitrary integers or text as
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

## `Code` As A Value

Use `fn` when behavior itself is the value:

```frothy
to twice with action [
  action:;
  action:
]

flash is fn [
  led.blink: 1, 50
]

twice: flash
```

Computed calls use `call` when the callee is the result of an expression:

```frothy
call flash with
```

Most code does not need that form. A named call is clearer when the callee is
already a name:

```frothy
flash:
```

The old quotation chapter was about choosing and executing delayed code. The
current Frothy version is the same idea with less stack ceremony: blocks are
lexical, `Code` is a value, and calls say their arguments out loud.

Next: [Errors and recovery](/guide/07-error-handling/).
