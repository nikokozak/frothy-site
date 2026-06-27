---
title: "06. Blocks and Control Flow"
description: "Use blocks as lexical scopes and Code values; choose, repeat, and loop with explicit booleans."
weight: 6
aliases:
  - /guide/04-control-flow-cells-and-records/
---

Froth keeps code as a value, but the syntax is lexical and direct.

The most important rule is simple: a block creates a scope and yields the value
of its last expression.

```froth
to nextSpeed with speed [
  here candidate is speed + 10;
  clamp: candidate, 0, 100
]
```

The block's final expression is the call to `clamp`. That is the function's
result.

## `if`, `when`, and `unless`

Conditions must be `Bool`. Froth does not treat arbitrary integers or text as
truthy.

```froth
to led.byKnob with percent [
  if percent > 50 [
    led.on:
  ] else [
    led.off:
  ]
]
```

Use `when` for a one-sided action:

```froth
when joy.click?: [
  led.toggle:
]
```

Use `unless` when the negative condition reads better:

```froth
unless joy.click?: [
  grid.clear:
]
```

If an `if` has no `else` and the condition is false, it yields `nil`.

## `while`

`while` evaluates the condition before each iteration:

```froth
to waitForClick [
  while not joy.click?: [
    ms: 20
  ]
]
```

The body value is discarded. Use locals or top-level state for values you need
after the loop.

## `repeat`

Use `repeat` for counted loops:

```froth
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

```froth
to diagonal [
  grid.clear:;
  repeat grid.height as y [
    grid.set: y, y, true
  ];
  grid.show:
]
```

The index is a local for that iteration's body.

## `Code` As A Value

Use `fn` when behavior itself is the value:

```froth
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

```froth
call flash with
```

Most code does not need that form. A named call is clearer when the callee is
already a name:

```froth
flash:
```

The old quotation chapter was about choosing and executing delayed code. The
current Froth version is the same idea with less stack ceremony: blocks are
lexical, `Code` is a value, and calls say their arguments out loud.

Next: [Errors and recovery](/guide/07-error-handling/).
