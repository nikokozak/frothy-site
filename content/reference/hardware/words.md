---
title: "Board Words"
weight: 1
description: "One-page lookup table for Froth Machine words, arity, return value, and use."
---

This is the fast lookup page for workshop and Machine work. Follow a word link
for the full behavior card and example.

## Display

| Word | Arity | Returns | Use |
| --- | ---: | --- | --- |
| [`grid.width`](/reference/hardware/display/#grid-width) | 0 | `Int` | 12-column logical canvas width |
| [`grid.height`](/reference/hardware/display/#grid-height) | 0 | `Int` | 8-row logical canvas height |
| [`grid.clear:`](/reference/hardware/display/#grid-clear) | 0 | `nil` | Clear framebuffer |
| [`grid.set:`](/reference/hardware/display/#grid-set) | 3 | `nil` | Set `x, y, bool` pixel |
| [`grid.get:`](/reference/hardware/display/#grid-get) | 2 | `Bool` | Read `x, y` pixel |
| [`grid.toggle:`](/reference/hardware/display/#grid-toggle) | 2 | `nil` | Toggle `x, y` pixel |
| [`grid.rect:`](/reference/hardware/display/#grid-rect) | 5 | `nil` | Draw outline rectangle |
| [`grid.fill:`](/reference/hardware/display/#grid-fill) | 1 | `nil` | Fill all pixels with bool |
| [`grid.show:`](/reference/hardware/display/#grid-show) | 0 | `nil` | Flush framebuffer |
| [`matrix.init:`](/reference/hardware/display/#matrix-init) | 0 | `nil` | Initialize display |
| [`matrix.brightness!:`](/reference/hardware/display/#matrix-brightness) | 1 | `nil` | Set brightness |
| [`matrix.show:`](/reference/hardware/display/#matrix-show) | 0 | `nil` | Flush framebuffer |
| [`matrix.clear:`](/reference/hardware/display/#matrix-clear) | 0 | `nil` | Clear framebuffer |
| [`matrix.fill:`](/reference/hardware/display/#matrix-fill) | 1 | `nil` | Fill framebuffer |
| [`matrix.width`](/reference/hardware/display/#matrix-width) | 0 | `Int` | Display width |
| [`matrix.height`](/reference/hardware/display/#matrix-height) | 0 | `Int` | Display height |
| [`matrix.pixel@:`](/reference/hardware/display/#matrix-pixel) | 2 | `Bool` | Read pixel |
| [`matrix.pixel!:`](/reference/hardware/display/#matrix-pixel-2) | 3 | `nil` | Set pixel |
| [`matrix.line:`](/reference/hardware/display/#matrix-line) | 5 | `nil` | Draw line |
| [`matrix.rect:`](/reference/hardware/display/#matrix-rect) | 5 | `nil` | Draw outline rectangle |
| [`matrix.fillRect:`](/reference/hardware/display/#matrix-fillrect) | 5 | `nil` | Draw filled rectangle |
| [`tm1629.populate:`](/reference/hardware/display/#tm1629-populate) | 1 | `nil` | Fill from `fn with x, y` |
| [`tm1629.lifeStep:`](/reference/hardware/display/#tm1629-lifestep) | 0 | `nil` | Advance Life simulation |

## Input

| Word | Arity | Returns | Use |
| --- | ---: | --- | --- |
| [`joy.up?:`](/reference/hardware/input/#joy-up) | 0 | `Bool` | Joystick up |
| [`joy.down?:`](/reference/hardware/input/#joy-down) | 0 | `Bool` | Joystick down |
| [`joy.left?:`](/reference/hardware/input/#joy-left) | 0 | `Bool` | Joystick left |
| [`joy.right?:`](/reference/hardware/input/#joy-right) | 0 | `Bool` | Joystick right |
| [`joy.click?:`](/reference/hardware/input/#joy-click) | 0 | `Bool` | Joystick press |
| [`knob.left:`](/reference/hardware/input/#knob-left) | 0 | `Int` | Left knob `0..100` |
| [`knob.right:`](/reference/hardware/input/#knob-right) | 0 | `Int` | Right knob `0..100` |
| [`knob.left.raw:`](/reference/hardware/input/#knob-left-raw) | 0 | `Int` | Left raw ADC |
| [`knob.right.raw:`](/reference/hardware/input/#knob-right-raw) | 0 | `Int` | Right raw ADC |

## Utilities

| Word | Arity | Returns | Use |
| --- | ---: | --- | --- |
| [`millis:`](/reference/hardware/utilities/#millis) | 0 | `Int` | Uptime milliseconds |
| [`ms:`](/reference/hardware/utilities/#ms) | 1 | `nil` | Sleep milliseconds |
| [`random.below:`](/reference/hardware/utilities/#random-below) | 1 | `Int` | Random `0..n-1` |
| [`min:`](/reference/hardware/utilities/#min) | 2 | `Int` | Smaller value |
| [`max:`](/reference/hardware/utilities/#max) | 2 | `Int` | Larger value |
| [`clamp:`](/reference/hardware/utilities/#clamp) | 3 | `Int` | Clamp to range |
| [`wrap:`](/reference/hardware/utilities/#wrap) | 2 | `Int` | Wrap around range |
| [`map:`](/reference/hardware/utilities/#map) | 5 | `Int` | Scale between ranges |

## Base Image

| Word | Arity | Returns | Use |
| --- | ---: | --- | --- |
| `LED_BUILTIN` | 0 | `Int` | Built-in LED pin |
| `A0` | 0 | `Int` | Board analog pin |
| `BOOT_BUTTON` | 0 | `Int` | Boot button pin |
| [`gpio.mode:`](/reference/hardware/gpio/) | 2 | `nil` | Configure pin mode |
| [`gpio.write:`](/reference/hardware/gpio/) | 2 | `nil` | Write pin level |
| [`gpio.read:`](/reference/hardware/gpio/) | 1 | `Int` | Read pin level |
| [`gpio.input:`](/reference/hardware/gpio/) | 1 | `nil` | Configure input pin |
| [`gpio.output:`](/reference/hardware/base-image/) | 1 | `nil` | Configure output pin |
| [`gpio.high:`](/reference/hardware/base-image/) | 1 | `nil` | Set pin high |
| [`gpio.low:`](/reference/hardware/base-image/) | 1 | `nil` | Set pin low |
| [`gpio.toggle:`](/reference/hardware/base-image/) | 1 | `nil` | Toggle pin |
| [`blink:`](/reference/hardware/base-image/) | 3 | `nil` | Blink pin by count and delay |
| [`animate:`](/reference/hardware/base-image/) | 3 | `nil` | Repeat a step function with timing |
| [`led.pin`](/reference/hardware/base-image/) | 0 | `Int` | Default LED pin |
| [`led.on:`](/reference/hardware/base-image/) | 0 | `nil` | Turn default LED on |
| [`led.off:`](/reference/hardware/base-image/) | 0 | `nil` | Turn default LED off |
| [`led.toggle:`](/reference/hardware/base-image/) | 0 | `nil` | Toggle default LED |
| [`led.blink:`](/reference/hardware/base-image/) | 2 | `nil` | Blink default LED by count and delay |
| [`adc.read:`](/reference/hardware/base-image/) | 1 | `Int` | Read raw ADC pin |
| [`adc.max`](/reference/hardware/base-image/) | 0 | `Int` | Maximum ADC reading |
| [`adc.percent:`](/reference/hardware/base-image/) | 1 | `Int` | Read ADC pin as `0..100` |

## Source-Board Peripherals

These are not the beginner Machine path, but they are part of the maintained
source-board reference surface where the selected board exposes them.

| Family | Page | Use |
| --- | --- | --- |
| I2C | [I2C](/reference/hardware/i2c/) | Bus/device/register sensor work |
| UART | [UART](/reference/hardware/uart/) | Auxiliary serial devices and console routing |
| LEDC | [PWM and LEDC](/reference/hardware/pwm-and-ledc/) | PWM duty, hardware fade, servo pulses |

## Demos And Puzzle

| Word | Arity | Returns | Use |
| --- | ---: | --- | --- |
| `demo.pong.setup:` | 0 | `nil` | Initialize built-in Pong |
| `demo.pong.update:` | 0 | `nil` | Advance Pong model |
| `demo.pong.draw:` | 0 | `nil` | Draw Pong frame |
| `demo.pong.frame:` | 0 | `nil` | One Pong update/draw/sleep frame |
| `demo.pong.run:` | 0 | `nil` | Run Pong until joystick click |
| `puzzle.dot:` | 0 | `nil` | Workshop puzzle dot |
| `puzzle.frame:` | 0 | `nil` | Workshop puzzle frame |
| `puzzle.scene:` | 0 | `nil` | Workshop puzzle scene |
| `puzzle.reveal:` | 0 | `nil` | Workshop knob reveal |

Use `show @name` and `info @name` on the board for demo and puzzle internals;
those words are teaching examples rather than stable general-purpose APIs.
