---
title: "Input"
weight: 3
description: "Joystick, knob, and raw button input words for the Froth Machine."
---

Prefer `joy.*?` and `knob.*` for Machine sketches. Use raw GPIO only when you
are deliberately working below the workshop-friendly input layer.

## Joystick

**`joy.up?:`** *(input)* `() -> Bool`

Behavior: True while the joystick is held up.

```froth
when joy.up?: [ set player.y to player.y - 1 ]
```

**`joy.down?:`** *(input)* `() -> Bool`

Behavior: True while the joystick is held down.

```froth
when joy.down?: [ set player.y to player.y + 1 ]
```

**`joy.left?:`** *(input)* `() -> Bool`

Behavior: True while the joystick is held left.

```froth
when joy.left?: [ set player.x to player.x - 1 ]
```

**`joy.right?:`** *(input)* `() -> Bool`

Behavior: True while the joystick is held right.

```froth
when joy.right?: [ set player.x to player.x + 1 ]
```

**`joy.click?:`** *(input)* `() -> Bool`

Behavior: True while the joystick is pressed.

```froth
when joy.click?: [ grid.clear: ]
```

## Knobs

**`knob.left:`** *(input)* `() -> Int`

Behavior: Left knob as an easy-to-scale percentage-style value from `0` to
`100`.

```froth
knob.left:
```

**`knob.right:`** *(input)* `() -> Int`

Behavior: Right knob as an easy-to-scale percentage-style value from `0` to
`100`.

```froth
knob.right:
```

**`knob.left.raw:`** *(input raw)* `() -> Int`

Behavior: Raw ADC reading for the left knob.

```froth
knob.left.raw:
```

**`knob.right.raw:`** *(input raw)* `() -> Int`

Behavior: Raw ADC reading for the right knob.

```froth
knob.right.raw:
```

## Raw Button Pattern

**`gpio.input:`** *(GPIO)* `(pin) -> nil`

Behavior: Configure a pin for input.

```froth
gpio.input: BUTTON_2
```

**`gpio.read:`** *(GPIO)* `(pin) -> Int`

Behavior: Read the current pin level.

```froth
gpio.read: BUTTON_2
```

If you need a semantic helper, define one at the Froth layer:

```froth
button.two? is fn [
  gpio.input: BUTTON_2;
  (gpio.read: BUTTON_2) == 0
]
```

`BUTTON_1` and `A0` share the same raw GPIO on the mounted workshop board, so
prefer `joy.*?` and `knob.*` for first-time input work.
