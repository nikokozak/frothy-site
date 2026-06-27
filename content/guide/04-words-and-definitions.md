---
title: "04. Words and Definitions"
description: "Define callable Code values, choose a house style, and understand coherent redefinition."
weight: 4
aliases:
  - /guide/03-code-locals-and-blocks/
---

In Froth, a word is just a named value that can be called. There is no separate
function namespace. A top-level name can hold an integer, text, cells storage,
or `Code`. When the value is `Code`, calling it runs that code.

The shortest reusable definition looks like this:

```froth
to led.flash [
  led.on:;
  ms: 100;
  led.off:
]
```

Call it:

```froth
led.flash:
```

That definition creates or rebinds the top-level slot `led.flash` to a
zero-argument `Code` value.

## Definitions With Arguments

Use `with` when the code expects arguments:

```froth
to pulse with pin, wait [
  gpio.output: pin;
  gpio.high: pin;
  ms: wait;
  gpio.low: pin
]

pulse: LED_BUILTIN, 75
```

The parameter names are locals inside the body. They are not stack aliases;
they are ordinary names with lexical scope. That is the main readability win
over the old style. You can say `pin` and `wait` exactly where you need them.

## `to` And `fn`

The docs use two styles:

```froth
to pulse with pin, wait [
  gpio.high: pin;
  ms: wait;
  gpio.low: pin
]

heartbeat is fn [
  led.toggle:;
  ms: 250
]
```

Use `to name with ... [ ... ]` when the definition reads like a named action.
Use `name is fn [ ... ]` when the name feels like a value you are assigning.
Both produce a top-level slot holding `Code`.

Anonymous `Code` is useful when you want to pass behavior:

```froth
twice is fn with action [
  action:;
  action:
]

beep is fn [ led.blink: 1, 30 ]
twice: beep
```

`twice` does not care where the `Code` came from. It receives a callable value
and calls it.

## Coherent Redefinition

Redefinition is one of Froth's central promises. If code resolves a top-level
name at call time, it sees the current value in that slot.

```froth
to blink.fast [
  led.blink: 1, 40
]

to signal [
  blink.fast:
]

signal:

to blink.fast [
  led.blink: 3, 90
]

signal:
```

`signal` was not rewritten. It still looks up `blink.fast`, and that name now
holds different code.

## Non-Capturing Code

`Code` does not capture outer locals in the current language. This is rejected:

```froth
to make-blink with wait [
  fn with pin [
    gpio.high: pin;
    ms: wait;
    gpio.low: pin
  ]
]
```

The inner `fn` tries to use `wait` from the outer function. Froth requires you
to make that flow explicit. Usually the better definition is:

```froth
to blink.once with pin, wait [
  gpio.high: pin;
  ms: wait;
  gpio.low: pin
]
```

That keeps the code persistable and easy to inspect. The value you need is an
argument, not hidden closure state.

Next: [Locals, names, and state](/guide/05-perm-and-named/).
