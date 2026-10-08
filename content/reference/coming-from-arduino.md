---
title: "Coming from Arduino"
weight: 2
url: /coming-from-arduino/
description: "How the parts of an Arduino sketch map to Frothy words, and which boards work."
icon: arrow-left-right
tags: [arduino, translation, beginners]
guideTopic: true
---

Frothy runs on ESP32 and RP2040 boards. This page maps the parts of an Arduino
sketch to Frothy. It also shows the largest difference: you change a word while
the board runs it.

You program the board in the [browser editor](https://app.frothy.dev/editor), not
in the Arduino IDE. Install Frothy on the board once with the
[browser flasher](https://app.frothy.dev/flash). Then the editor connects to the
board over USB, and it sends your code to the board while the board runs.

## Boards

These boards have official Frothy firmware:

- ESP32 DevKit V1 and NodeMCU ESP-32S
- Seeed Studio XIAO ESP32C3, ESP32C6 and ESP32S3
- Seeed Studio XIAO RP2040
- Arduino Nano RP2040 Connect

Frothy has no firmware for the Arduino UNO, Nano, Nano Every, Nano 33 IoT or UNO
R4. Their chips are not ESP32 or RP2040 chips. The Arduino Nano ESP32 has an
ESP32-S3 chip, but it has no official Frothy firmware yet.

The pins of these boards use 3.3 V. Do not connect a 5 V signal to a pin.

## A Sketch Becomes Words

This Arduino sketch blinks the built-in LED:

```cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
```

Frothy has no `setup` and no `loop`. You send code to the board while it runs,
with **Run Line** in the editor or Enter at a prompt. A definition takes effect
at once, and a call runs at once. Here an event calls `tick` every 500 ms:

```frothy
to tick [ led.toggle: ]
to blink.start [ every 500 [ tick: ] ]
blink.start:
```

The prompt stays free while the LED blinks. Define `tick` again, and the next
event runs the new word. You do not upload anything, and the board does not
restart:

```frothy
to tick [ led.on: ]
```

Stop the event with `cancel every 500`. Type `save` to keep your words after a
restart. A word named `boot` runs when the board starts:

```frothy
to boot [ blink.start: ]
save
```

The LED words need a board with a built-in LED. On a board without one,
`$led_builtin` is `nil` and `led.on:` stops with an error. Use
`gpio.write: pin, 1` with the pin of your own LED.

## Arduino Calls And Frothy Words

A colon calls a word. Arguments follow the colon, separated by commas. A word
with no arguments still needs the colon: `millis:`.

| Arduino | Frothy | Note |
| --- | --- | --- |
| `pinMode(pin, OUTPUT)` | `gpio.mode: pin, 1` | |
| `pinMode(pin, INPUT)` | `gpio.mode: pin, 0` | |
| `pinMode(pin, INPUT_PULLUP)` | `gpio.mode: pin, 2` | |
| `digitalWrite(pin, HIGH)` | `gpio.write: pin, 1` | `0` for `LOW` |
| `digitalRead(pin)` | `gpio.read: pin` | `0` or `1` |
| `analogRead(A0)` | `adc.read: $a0` | `0` to `4095` |
| `analogWrite(pin, value)` | `h is pwm.open: pin, 1000`, then `pwm.write: h, duty` | duty is `0` to `10000`; for Arduino's `0` to `255`, use `value * 10000 / 255` |
| `delay(ms)` | `wait: ms` | |
| `millis()` | `millis:` | |
| `Serial.print("hi")` | `print: "hi"` | |
| `Serial.println("hi")` | `print: "hi\n"` | `print:` adds no line end |
| `LED_BUILTIN` | `$led_builtin` | `nil` without an LED |
| `A0` | `$a0` | |
| `a == b`, `a != b` | `a = b`, `a <> b` | |
| `// note` | `-- note` | |

`pwm.open:` gives a handle. Close the channel with `pwm.close: h`. A saved handle
comes back as `nil` after a restart, so open the channel again in `boot`.

## Numbers

Frothy has integers only. `3.14` is an error. To see a number at the prompt,
type it or a name that holds it.

`print:` takes text, not an integer. A word that runs in a loop can print a
number with this word. It resets and reuses the fixed 64-byte PAD for each
number, so a long loop does not fill memory:

```frothy
to print-int with n [
  here v is n
  pad.reset:
  when v < 0 [
    pad.emit-byte: 45
    set v to 0 - v
  ]
  here div is 1
  while v / div >= 10 [ set div to div * 10 ]
  while div > 0 [
    pad.emit-byte: 48 + v / div % 10
    set div to div / 10
  ]
  pad.type:
]
```

The prompt reads one line at a time. Send a word of several lines from the
editor or with `frothy send`.

## What Does Not Carry Over

Most Arduino libraries have no Frothy version. Frothy has built-in words for
GPIO, ADC, PWM, I2C and UART. Read the [hardware reference](/reference/hardware/)
before you choose a part.
