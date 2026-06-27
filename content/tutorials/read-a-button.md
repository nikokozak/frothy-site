---
title: "Read a Button"
weight: 3
description: "Read a digital input, turn it into a boolean, and use it to control visible state."
---

The LED tutorial drove an output. This one reads an input. A button is the
cleanest first input because it only has two states: pressed or not pressed.

You can do this on a plain ESP32 board with `BOOT_BUTTON`, or on the Froth
Machine with `joy.click?`.

## Start With The Built-In Button

On ESP32 DevKit-style boards, the boot button is active-low. Released reads
high. Pressed reads low.

```froth
gpio.input: BOOT_BUTTON
gpio.read: BOOT_BUTTON
```

Hold the button and read again. The value should change from `1` to `0`.

Wrap the electrical detail in a name:

```froth
to boot.pressed? [
  (gpio.read: BOOT_BUTTON) == 0
]
```

Now the rest of the code can use a boolean instead of remembering that this
button is active-low.

## Light The LED While Pressed

Configure the output once:

```froth
gpio.output: LED_BUILTIN
```

Then define one frame:

```froth
button.frame is fn [
  if boot.pressed?: [
    gpio.high: LED_BUILTIN
  ] else [
    gpio.low: LED_BUILTIN
  ]
]
```

Run it in a short loop:

```froth
repeat 300 [
  button.frame:;
  ms: 20
]
```

Hold the button. The LED follows your hand.

## Detect A Press Edge

Most button programs should react once per press, not on every poll while the
button is held. Store the previous state:

```froth
button.prev is false
button.led is false
```

Detect the transition from not pressed to pressed:

```froth
button.fell? is fn [
  here now is boot.pressed?:;
  here fresh is now and (not button.prev);
  set button.prev to now;
  fresh
]
```

Toggle the LED on that edge:

```froth
button.toggleFrame is fn [
  when button.fell?: [
    set button.led to (not button.led);
    if button.led [
      gpio.high: LED_BUILTIN
    ] else [
      gpio.low: LED_BUILTIN
    ]
  ]
]
```

Run it:

```froth
repeat 600 [
  button.toggleFrame:;
  ms: 20
]
```

Each press toggles once. Holding the button does not keep firing.

## Froth Machine Shortcut

On the Machine, the joystick click already has a semantic helper:

```froth
joy.click?:
```

Use the same edge pattern:

```froth
joy.prev is false

joy.clicked? is fn [
  here now is joy.click?:;
  here fresh is now and (not joy.prev);
  set joy.prev to now;
  fresh
]
```

The wiring is different, but the program shape is the same: convert the raw
input to a boolean, detect the transition you care about, then update visible
state.
