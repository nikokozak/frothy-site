---
title: "03. Values and Expressions"
description: "Values, calls, grouping, and left-to-right evaluation."
weight: 3
aliases:
  - /guide/02-values-names-and-rebinding/
icon: hash
readTime: "5 min"
---

Frothy does not put a data stack in the center of the public language. The
runtime still has internal machinery, but the language you write is organized
around values, expressions, names, and calls.

That shift is not cosmetic. It changes how you read code.

```frothy
3 + 4
```

This is an expression. It evaluates to `7`. Operators are ordinary parts of
the expression grammar, not postfix stack words. Binary operators have equal
precedence and associate left to right, so use parentheses when grouping
matters:

```frothy
(3 + 4) * 2
3 + (4 * 2)
```

Frothy does not reward guessing precedence. Group the expression you mean.

## The Value Set

The core value classes are deliberately small:

- `Int`
- `Bool`
- `Nil`
- `Text`
- `Cells`
- `Code`

Everything user-facing is either a value or a place that holds one. There are
no raw pointers, general foreign handles, or implementation-private control
objects in the ordinary language.

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
  ms: 75;
  gpio.low: pin
]

pulse: $led_builtin

to pulse with pin [
  gpio.high: pin;
  ms: 20;
  gpio.low: pin
]
```

The name is stable. The value changed. The image remains inspectable.

## Calls Read Like Calls

Foreign bindings and Frothy definitions use the same call surface:

```frothy
gpio.write: $led_builtin, 1
ms: 100
blink: $led_builtin, 3, 75
```

The callee appears before the colon. Arguments follow after the colon,
separated by commas. A zero-argument call still uses the colon when you are
asking for the code to run:

```frothy
matrix.init:
grid.show:
```

Without the call, a name is a value lookup. That distinction is why `Code` can
be passed around like any other value.

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

The old stack chapter taught how to keep track of invisible intermediate
values. In current Frothy, the equivalent discipline is simpler: name the state
you intend to keep, group expressions that need grouping, and inspect the live
image when you are not sure what a name currently holds.

Next: [Words and definitions](/guide/04-words-and-definitions/).
