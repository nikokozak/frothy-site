---
title: "03. Values and Expressions"
description: "Learn the values Frothy carries, how calls read, and how expressions group."
weight: 3
aliases:
  - /guide/02-values-names-and-rebinding/
icon: hash
readTime: "5 min"
---

You can learn a surprising amount about Frothy from one line:

```frothy
2 * 3 + 4
```

This expression evaluates to `10`. Frothy uses conventional operator
precedence: `*`, `/`, and `%` bind tighter than `+` and `-`; comparisons come
next; then `and`; then `or`. Operators in the same group associate from left to
right.

```frothy
2 * 3 + 4
(2 + 3) * 4
1 < 2 and 3 < 4
```

Those expressions yield `10`, `20`, and `true`. Parentheses are still welcome
whenever they make the intended grouping easier to see.

## The Value Set

A full Frothy profile can carry:

- `Int`, `Bool`, and `Nil` for small immediate values
- `Text` for immutable, byte-oriented text
- `Cells` for fixed-size indexed storage
- record values for data with named fields
- `Code` for executable behavior
- `Bytes` for transient working bytes
- `Handle` for a live platform resource such as PWM, UART, I2C, or TCP

Smaller profiles can leave out value families they cannot afford. The ESP32
plain profile exposes the full documented set.

Text, cells, records, and code can be part of a saved overlay. `Bytes` and
`Handle` are deliberately live values: pack bytes into `Text` when you need a
persistent copy, and reopen hardware resources from `boot` after restore. A
handle is a tagged Frothy value, not a raw pointer or a disguised integer.

## Names Hold The Conversation Together

At top level, a name refers to a stable slot:

```frothy
speed is 75
speed is 120
```

That is a rebind, not a fresh variable floating in space. The top-level slot
named `speed` is the same slot before and after the second line. What changed
is the value currently stored there.

That matters for live work. If one piece of code calls `pulse`, and you later
rebind `pulse`, callers that resolve through that top-level slot see the new
behavior.

```frothy
to pulse with pin [
  gpio.high: pin;
  wait: 75;
  gpio.low: pin
]

pulse: $led_builtin

to pulse with pin [
  gpio.high: pin;
  wait: 20;
  gpio.low: pin
]
```

The name is stable. The value changed. The image remains inspectable.

## Calls Read Like Calls

Foreign bindings and Frothy definitions use the same call surface:

```frothy
gpio.write: $led_builtin, 1
wait: 100
blink: $led_builtin, 3, 75
```

The callee appears before the colon. Arguments follow after the colon,
separated by commas. A zero-argument call still uses the colon when you are
asking for the code to run:

```frothy
led.on:
millis:
```

Without the call, a name is a value lookup. That distinction lets you inspect
or pass a `Code` value without running it.

## Lookup Order

When Frothy sees a name, it searches:

1. the current local scope
2. enclosing local scopes
3. top-level slots

A local can shadow a top-level name:

```frothy
speed is 75

demo is fn [
  here speed is 10;
  speed
]
```

Inside `demo`, `speed` means the local. Outside it, `speed` still means the
top-level slot.

The reading habit is simple: name state you intend to keep, group expressions
when it helps the story, and remember that a colon turns a name lookup into a
call.

Next: [Words and definitions](/guide/04-words-and-definitions/).
