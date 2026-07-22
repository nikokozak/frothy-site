---
title: "Blink an LED"
weight: 1
description: "Connect to a board, configure the LED pin, define a blink word, change it live, and save the image."
---

Blinking an LED is the hardware hello world. It proves three things at once:
your host can talk to the board, the board can run Frothy code immediately, and
a definition you make at the prompt becomes part of the live image.

## Check The Board

Run the environment check first:

```sh
frothy doctor
```

If more than one serial device is visible, pass the port explicitly:

```sh
frothy --port /dev/tty.usbserial-XXXX doctor
```

Then connect:

```sh
frothy --port /dev/tty.usbserial-XXXX connect
```

## Configure The Pin

Use the board-provided pin name instead of the raw GPIO number:

```frothy
gpio.mode: $led_builtin, 1
```

Then drive it by hand:

```frothy
gpio.high: $led_builtin
wait: 200
gpio.low: $led_builtin
```

If the LED does not change, stop here. Check the board, the port, and whether
your board's built-in LED is active-high or active-low. Do not hide a wiring
or board-selection problem inside a larger definition.

## Define A Pulse

At the prompt, define one small word:

```frothy
to pulse with pin, delay [
  gpio.high: pin;
  wait: delay;
  gpio.low: pin;
  wait: delay
]
```

Call it once:

```frothy
pulse: $led_builtin, 120
```

You should see the LED turn on briefly, then turn off.

If the word is wrong, redefine the same name. You do not need to restart the
session.

## Build A Blink Word

Now define a repeated blink:

```frothy
to blink with pin [
  repeat 3 [
    pulse: pin, 120
  ]
]
```

Run it:

```frothy
blink: $led_builtin
```

The important part is not the blink. The important part is that `blink` lives
in the current device image. You can inspect it and change it without reflashing
the board.

## Redefine It Live

Change the timing:

```frothy
to blink with pin [
  repeat 5 [
    pulse: pin, 50
  ]
]
```

Call the same name again:

```frothy
blink: $led_builtin
```

The top-level slot named `blink` stayed stable. Its current value changed. Any
later call resolves through that same slot and sees the new behavior.

Inspect it:

```frothy
see blink
words
```

`see` shows the source the running image currently holds for a word, and
`words` lists everything defined — not what you remember typing ten minutes ago.

## Put It On Boot

If you want the board to blink after restore, bind `boot` to a small setup
word:

```frothy
to boot [
  gpio.mode: $led_builtin, 1;
  blink: $led_builtin
]
```

Keep `boot` short. Hardware setup and one obvious entry point are fine. A large
uninterruptible program is harder to recover from.

## Save Or Reset

When you want the overlay image to survive a reboot:

```frothy
save
```

If you want to return to the base image:

```frothy
dangerous.wipe
```

Use `dangerous.wipe` intentionally. It clears the saved overlay and the live
overlay state.
