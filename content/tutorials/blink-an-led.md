---
title: "Blink an LED"
weight: 1
description: "Connect to a board, configure the LED pin, define a blink word, change it live, and save the image."
---

Blinking an LED is the hardware hello world. It proves three things at once:
your host can talk to the board, the board can run Froth code immediately, and
a definition you make at the prompt becomes part of the live image.

## Check The Board

Run the environment check first:

```sh
froth doctor
```

If more than one serial device is visible, pass the port explicitly:

```sh
froth --port /dev/tty.usbserial-XXXX doctor
```

Then connect:

```sh
froth --port /dev/tty.usbserial-XXXX connect
```

## Configure The Pin

Use the board-provided pin name instead of the raw GPIO number:

```froth
gpio.output: LED_BUILTIN
```

Then drive it by hand:

```froth
gpio.high: LED_BUILTIN
ms: 200
gpio.low: LED_BUILTIN
```

If the LED does not change, stop here. Check the board, the port, and whether
your board's built-in LED is active-high or active-low. Do not hide a wiring
or board-selection problem inside a larger definition.

## Define A Pulse

At the prompt, define one small word:

```froth
to pulse with pin, wait [
  gpio.high: pin;
  ms: wait;
  gpio.low: pin;
  ms: wait
]
```

Call it once:

```froth
pulse: LED_BUILTIN, 120
```

You should see the LED turn on briefly, then turn off.

If the word is wrong, redefine the same name. You do not need to restart the
session.

## Build A Blink Word

Now define a repeated blink:

```froth
to blink with pin [
  repeat 3 [
    pulse: pin, 120
  ]
]
```

Run it:

```froth
blink: LED_BUILTIN
```

The important part is not the blink. The important part is that `blink` lives
in the current device image. You can inspect it and change it without reflashing
the board.

## Redefine It Live

Change the timing:

```froth
to blink with pin [
  repeat 5 [
    pulse: pin, 50
  ]
]
```

Call the same name again:

```froth
blink: LED_BUILTIN
```

The top-level slot named `blink` stayed stable. Its current value changed. Any
later call resolves through that same slot and sees the new behavior.

Inspect it:

```froth
show @blink
see @blink
info @blink
```

Those tools show what the running image currently knows, not what you remember
typing ten minutes ago.

## Put It On Boot

If you want the board to blink after restore, bind `boot` to a small setup
word:

```froth
to boot [
  gpio.output: LED_BUILTIN;
  blink: LED_BUILTIN
]
```

Keep `boot` short. Hardware setup and one obvious entry point are fine. A large
uninterruptible program is harder to recover from.

## Save Or Reset

When you want the overlay image to survive a reboot:

```froth
save
```

If you want to return to the base image:

```froth
dangerous.wipe
```

Use `dangerous.wipe` intentionally. It clears the saved overlay and the live
overlay state.
