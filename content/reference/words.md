---
title: "Word Catalog"
weight: 2
description: "Canonical lookup entries for Frothy words, forms, constants, and prompt-facing built-ins."
icon: hash
tags: [words, built-ins, catalog]
wordCatalog: true
---

Use this page when you know the word you want and need its signature, one-line purpose, and a small example.

Syntax and semantic rules live in [Frothy in Y
Minutes](/reference/language/). [Module pages](/reference/modules/) link back
here for canonical word entries.

## Language Forms

<a id="is"></a>
**`is`** *(language)* `name is expr`

Creates or rebinds a top-level slot from a literal, existing name, `fn`,
`cells`, record value, or word-call result. Use `set` after initialization for
an operator or control-flow expression.

**Example**

```frothy
counter is 0
set counter to counter + 1
```

---

<a id="to"></a>
**`to`** *(language)* `to name with params [ body ]`

Binds a top-level word to a `Code` value.

**Example**

```frothy
to double with n [ n * 2 ]
double: 21
```

---

<a id="fn"></a>
**`fn`** *(language)* `fn with params [ body ]`

Creates a non-capturing `Code` value for a top-level binding. Calls resolve
top-level word names; Frothy has no dynamic `call` word for a parameter or
local holding Code.

**Example**

```frothy
adder is fn with x, y [ x + y ]
adder: 20, 22
```

---

<a id="here"></a>
**`here`** *(language)* `here name is expr`

Declares a lexical local in the current block.

**Example**

```frothy
to demo [ here speed is 10; speed ]
```

---

<a id="set"></a>
**`set`** *(language)* `set place to expr`

Mutates an existing name, cells element, or record field.

**Example**

```frothy
set counter to counter + 1
set readings[0] to 11
set point -> x to 30
```

---

<a id="if"></a>
**`if`** *(language)* `if cond [ then ] else [ fallback ]`

Chooses between blocks and yields the chosen block's value.

**Example**

```frothy
if n < 2 [ n ] else [ fib: n - 1 + fib: n - 2 ]
```

---

<a id="when"></a>
**`when`** *(language)* `when cond [ body ]`

Runs a one-sided conditional block and yields `nil` when the condition is false.

**Example**

```frothy
when adc.percent: $a0 > 50 [ led.on: ]
```

---

<a id="unless"></a>
**`unless`** *(language)* `unless cond [ body ]`

Runs a one-sided conditional block when the condition is false.

**Example**

```frothy
unless ready [ led.off: ]
```

---

<a id="while"></a>
**`while`** *(language)* `while cond [ body ]`

Repeats a block while the condition stays truthy.

**Example**

```frothy
while x > 0 [ set x to x - 1 ]
```

---

<a id="repeat"></a>
**`repeat`** *(language)* `repeat count as i [ body ]`

Repeats a block a fixed number of times, optionally binding a zero-based index.

**Example**

```frothy
repeat 10 as i [ set total to total + i ]
```

---

<a id="forever"></a>
**`forever`** *(language)* `forever [ body ]`

Repeats a block until interrupted or until the body errors.

**Example**

```frothy
forever [ led.toggle:; ms: 100 ]
```

---

<a id="cells"></a>
**`cells`** *(language)* `cells(length) -> Cells`

Creates fixed-size mutable indexed storage.

**Example**

```frothy
readings is cells(3)
set readings[0] to 11
```

---

<a id="record"></a>
**`record`** *(language)* `record Name [ fields ]`

Declares a top-level record shape and constructor.

**Example**

```frothy
record pt [ x, y ]
p is pt: 3, 4
```

---

<a id="attempt"></a>
**`attempt`** *(language)* `attempt [ body ] rescue [ fallback ]`

Runs fallback code after a catchable runtime error and yields the fallback value.

**Example**

```frothy
1 + attempt [ 2 / 0 ] rescue [ 9 ]
```

---

<a id="error-code"></a>
**`error.code`** *(language)* `error.code -> Int`

Reads the caught runtime error code inside a rescue block.

**Example**

```frothy
attempt [ 2 / 0 ] rescue [ error.code ]
```

---

<a id="error-name"></a>
**`error.name`** *(language)* `error.name -> Text`

Reads the caught runtime error name inside a rescue block.

**Example**

```frothy
attempt [ missing: ] rescue [ error.name ]
```

---

<a id="on"></a>
**`on`** *(events)* `on source edge [ body ]`

Registers a GPIO or Wi-Fi event body from inside a definition.

**Example**

```frothy
to arm-button [ on $boot_button falling [ led.toggle: ] ]
```

---

<a id="every"></a>
**`every`** *(events)* `every millis [ body ]`

Registers a repeating timer event from inside a definition.

**Example**

```frothy
to start-ticking [ every 1000 [ print: "tick" ] ]
```

---

<a id="after"></a>
**`after`** *(events)* `after millis [ body ]`

Registers a one-shot timer event from inside a definition.

**Example**

```frothy
to once [ after 500 [ led.off: ] ]
```

---

<a id="cancel"></a>
**`cancel`** *(events)* `cancel source`

Cancels a GPIO, timer, or Wi-Fi event by its event source identity.

**Example**

```frothy
cancel every 1000
cancel $boot_button
```

## Values And Image

<a id="nil"></a>
**`nil`** *(value)* `nil`

Represents no value and takes the false branch.

**Example**

```frothy
if nil [ 1 ] else [ 2 ]
```

---

<a id="true"></a>
**`true`** *(value)* `true`

Represents boolean truth.

**Example**

```frothy
if true [ led.on: ]
```

---

<a id="false"></a>
**`false`** *(value)* `false`

Represents boolean falsehood and takes the false branch.

**Example**

```frothy
if false [ 1 ] else [ 2 ]
```

---

<a id="boot"></a>
**`boot`** *(image)* `boot -> Code|nil`

Runs after restore when the top-level slot holds `Code`.

**Example**

```frothy
boot is fn [ led.on: ]
save
```

---

<a id="one"></a>
**`one`** *(image)* `one -> Int`

Base-image literal for the integer `1`.

**Example**

```frothy
one + 41
```

---

<a id="save"></a>
**`save`** *(persistence)* `save -> nil`

Writes the current overlay image to persistent storage.

**Example**

```frothy
save
```

---

<a id="restore"></a>
**`restore`** *(persistence)* `restore -> nil`

Replaces the live overlay with the saved overlay.

**Example**

```frothy
restore
```

---

<a id="dangerous-wipe"></a>
**`dangerous.wipe`** *(persistence)* `dangerous.wipe -> nil`

Clears the live and saved overlay and returns to the base image.

**Example**

```frothy
dangerous.wipe
```

---

<a id="words"></a>
**`words`** *(inspection)* `words`

Lists visible names at the prompt.

**Example**

```frothy
words
```

---

<a id="see"></a>
**`see`** *(inspection)* `see name`

Renders the source form for a binding.

**Example**

```frothy
see boot
```

---

<a id="status"></a>
**`status`** *(inspection)* `status`

Reports session and runtime status at the prompt.

**Example**

```frothy
status
```

---

<a id="events"></a>
**`events`** *(inspection)* `events`

Lists active timer, GPIO, and Wi-Fi event bindings.

**Example**

```frothy
events
```

---

<a id="mem"></a>
**`mem`** *(inspection)* `mem [heap|slots|objects|events]`

Reports live capacity usage, optionally narrowed to one topic.

**Example**

```frothy
mem
mem objects
```

---

<a id="clear"></a>
**`clear`** *(inspection)* `clear`

Removes the live overlay and returns to the base image without deleting the
saved overlay.

**Example**

```frothy
clear
restore
```

---

<a id="apply"></a>
**`apply`** *(wire command)* `apply HEX`

Decodes one serialized overlay update and installs it. This is a host-tool
protocol command, not Frothy source; the decoded payload must fit the
`apply_bytes` capacity reported by `status`.

**Example**

```text
apply 46524f...
```

---

<a id="run"></a>
**`run`** *(wire command)* `run HEX`

Decodes and executes one serialized instruction stream without installing it.
This is a host-tool protocol command, not a dynamic Code-call word.

**Example**

```text
run 0102...
```

---

<a id="install-library"></a>
**`install-library`** *(installation command)* `install-library`

Begins replacement of the persistent library tier and sends following
definitions to that tier. The CLI and editor own this lifecycle; do not use it
as ordinary project source.

**Example**

```text
install-library
```

---

<a id="install-user"></a>
**`install-user`** *(installation command)* `install-user`

Selects the user tier for following definitions after a library installation.

**Example**

```text
install-user
```

---

<a id="wipe-user"></a>
**`wipe-user`** *(installation command)* `wipe-user`

Removes and commits the user tier while preserving the installed library tier.
This is the project-sync primitive used by host tooling.

**Example**

```text
wipe-user
```

---

<a id="print"></a>
**`print`** *(io)* `(Text|Bytes) -> nil`

Writes raw text or bytes to the console output.

**Example**

```frothy
print: "hello"
```

## GPIO, ADC, And LED

<a id="led-builtin"></a>
**`$led_builtin`** *(constant)* `Int`

Names the board's built-in LED pin.

**Example**

```frothy
gpio.output: $led_builtin
```

---

<a id="a0"></a>
**`$a0`** *(constant)* `Int`

Names the board's default ADC input pin.

**Example**

```frothy
adc.read: $a0
```

---

<a id="boot-button"></a>
**`$boot_button`** *(constant)* `Int`

Names the board boot button pin.

**Example**

```frothy
gpio.read: $boot_button
```

---

<a id="led-active-level"></a>
**`$led_active_level`** *(constant)* `Int`

The electrical level that turns the current board's built-in LED on.

**Example**

```frothy
gpio.write: $led_builtin, $led_active_level
```

---

<a id="sda"></a>
**`$sda`** *(constant)* `Int`

The board's default I2C SDA pin.

**Example**

```frothy
bus is i2c.open: 0, $sda, $scl, 400000
```

---

<a id="scl"></a>
**`$scl`** *(constant)* `Int`

The board's default I2C SCL pin.

**Example**

```frothy
bus is i2c.open: 0, $sda, $scl, 400000
```

---

<a id="gpio-mode"></a>
**`gpio.mode`** *(gpio)* `(pin, mode) -> nil`

Configures a GPIO pin direction with `1` for output and `0` for input.

**Example**

```frothy
gpio.mode: $led_builtin, 1
```

---

<a id="gpio-write"></a>
**`gpio.write`** *(gpio)* `(pin, level) -> nil`

Writes a GPIO output level.

**Example**

```frothy
gpio.write: $led_builtin, 1
```

---

<a id="pin"></a>
**`pin`** *(gpio alias)* `(pin, level) -> nil`

Alias for `gpio.write`, retained for the shortest direct pin writes.

**Example**

```frothy
pin: $led_builtin, 1
```

---

<a id="gpio-read"></a>
**`gpio.read`** *(gpio)* `(pin) -> Int`

Reads a GPIO input level.

**Example**

```frothy
gpio.read: $boot_button
```

---

<a id="gpio-high"></a>
**`gpio.high`** *(gpio helper)* `(pin) -> nil`

Writes level `1` to a GPIO pin.

**Example**

```frothy
gpio.high: $led_builtin
```

---

<a id="gpio-low"></a>
**`gpio.low`** *(gpio helper)* `(pin) -> nil`

Writes level `0` to a GPIO pin.

**Example**

```frothy
gpio.low: $led_builtin
```

---

<a id="gpio-toggle"></a>
**`gpio.toggle`** *(gpio helper)* `(pin) -> nil`

Writes the opposite of the pin's current GPIO level.

**Example**

```frothy
gpio.toggle: $led_builtin
```

---

<a id="gpio-output"></a>
**`gpio.output`** *(gpio helper)* `(pin) -> nil`

Configures a GPIO pin as output.

**Example**

```frothy
gpio.output: $led_builtin
```

---

<a id="gpio-input"></a>
**`gpio.input`** *(gpio helper)* `(pin) -> nil`

Configures a GPIO pin as input.

**Example**

```frothy
gpio.input: $boot_button
```

---

<a id="led-on"></a>
**`led.on`** *(led helper)* `() -> nil`

Turns on the board's default LED.

**Example**

```frothy
led.on:
```

---

<a id="led-off"></a>
**`led.off`** *(led helper)* `() -> nil`

Turns off the board's default LED.

**Example**

```frothy
led.off:
```

---

<a id="led-toggle"></a>
**`led.toggle`** *(led helper)* `() -> nil`

Toggles the board's default LED.

**Example**

```frothy
led.toggle:
```

---

<a id="blink"></a>
**`blink`** *(led helper)* `(pin, count, wait) -> nil`

Blinks a pin by alternating high, sleep, low, sleep.

**Example**

```frothy
blink: $led_builtin, 3, 75
```

---

<a id="led-blink"></a>
**`led.blink`** *(led helper)* `(count, wait) -> nil`

Blinks the board's default LED.

**Example**

```frothy
led.blink: 3, 75
```

---

<a id="adc-read"></a>
**`adc.read`** *(adc)* `(pin) -> Int`

Reads a raw ADC value from a pin.

**Example**

```frothy
adc.read: $a0
```

---

<a id="adc-above"></a>
**`adc.above`** *(adc)* `(pin, threshold) -> Bool`

Returns true when a raw ADC reading is above a threshold.

**Example**

```frothy
adc.above: $a0, 2000
```

---

<a id="adc-percent"></a>
**`adc.percent`** *(adc helper)* `(pin) -> Int`

Maps a raw 0 to 4095 ADC reading to 0 to 100.

**Example**

```frothy
adc.percent: $a0
```

## Timing, Math, And Random

<a id="ms"></a>
**`ms`** *(timing)* `(millis) -> nil`

Sleeps for a nonnegative number of milliseconds while still polling interrupts.

**Example**

```frothy
ms: 75
```

---

<a id="millis"></a>
**`millis`** *(timing)* `() -> Int`

Reads milliseconds since boot, wrapped to the tagged integer range.

**Example**

```frothy
millis:
```

---

<a id="micros"></a>
**`micros`** *(timing)* `() -> Int`

Reads microseconds since boot, wrapped to the tagged integer range.

**Example**

```frothy
micros:
```

---

<a id="abs"></a>
**`abs`** *(math)* `(x) -> Int`

Returns the absolute value of an integer.

**Example**

```frothy
abs: -5
```

---

<a id="min"></a>
**`min`** *(math)* `(a, b) -> Int`

Returns the smaller of two integers.

**Example**

```frothy
min: 3, 9
```

---

<a id="max"></a>
**`max`** *(math)* `(a, b) -> Int`

Returns the larger of two integers.

**Example**

```frothy
max: 3, 9
```

---

<a id="clamp"></a>
**`clamp`** *(math)* `(x, lo, hi) -> Int`

Clamps an integer to an inclusive range.

**Example**

```frothy
clamp: 120, 0, 100
```

---

<a id="map"></a>
**`map`** *(math)* `(x, in_lo, in_hi, out_lo, out_hi) -> Int`

Linearly maps an integer from one range to another.

**Example**

```frothy
map: 2048, 0, 4095, 0, 100
```

---

<a id="mod"></a>
**`mod`** *(math)* `(a, b) -> Int`

Returns `a` modulo `b` with the runtime's integer semantics.

**Example**

```frothy
mod: 37, 10
```

---

<a id="sqrt"></a>
**`sqrt`** *(math)* `(x) -> Int`

Returns the floor square root of a nonnegative integer.

**Example**

```frothy
sqrt: 81
```

---

<a id="wrap"></a>
**`wrap`** *(math helper)* `(value, size) -> Int`

Returns `0` for nonpositive sizes, otherwise `mod: value, size`.

**Example**

```frothy
wrap: 37, 10
```

---

<a id="sign"></a>
**`sign`** *(math helper)* `(n) -> Int`

Clamps an integer to `-1`, `0`, or `1`.

**Example**

```frothy
sign: -20
```

---

<a id="random-next"></a>
**`random.next`** *(random)* `() -> Int`

Returns the next pseudo-random nonnegative integer.

**Example**

```frothy
random.next:
```

---

<a id="random-below"></a>
**`random.below`** *(random)* `(limit) -> Int`

Returns a pseudo-random integer in `[0, limit)`.

**Example**

```frothy
random.below: 10
```

---

<a id="random-seed"></a>
**`random.seed`** *(random)* `(seed) -> nil`

Seeds the pseudo-random generator.

**Example**

```frothy
random.seed: 123
```

---

<a id="random-chance"></a>
**`random.chance?`** *(random helper)* `(numer, denom) -> Bool`

Returns true when a random draw falls inside a numerator over denominator chance.

**Example**

```frothy
random.chance?: 1, 4
```

---

<a id="random-percent"></a>
**`random.percent?`** *(random helper)* `(percent) -> Bool`

Returns true for a percentage chance from 0 to 100.

**Example**

```frothy
random.percent?: 25
```

## UART, I2C, And PWM

<a id="baud-9600"></a>
**`$baud_9600`** *(uart constant)* `Int`

Names the UART baud-rate code for 9600 baud.

**Example**

```frothy
uart.open: 1, $baud_9600
```

---

<a id="baud-19200"></a>
**`$baud_19200`** *(uart constant)* `Int`

Names the UART baud-rate code for 19200 baud.

**Example**

```frothy
uart.open: 1, $baud_19200
```

---

<a id="baud-38400"></a>
**`$baud_38400`** *(uart constant)* `Int`

Names the UART baud-rate code for 38400 baud.

**Example**

```frothy
uart.open: 1, $baud_38400
```

---

<a id="baud-57600"></a>
**`$baud_57600`** *(uart constant)* `Int`

Names the UART baud-rate code for 57600 baud.

**Example**

```frothy
uart.open: 1, $baud_57600
```

---

<a id="baud-115200"></a>
**`$baud_115200`** *(uart constant)* `Int`

Names the UART baud-rate code for 115200 baud.

**Example**

```frothy
uart.open: 1, $baud_115200
```

---

<a id="baud-1200"></a>
**`$baud_1200`** *(uart constant)* `Int`

Names the UART baud rate 1200.

**Example**

```frothy
uart.open: 1, $baud_1200
```

---

<a id="uart-open"></a>
**`uart.open`** *(uart)* `(port, baud) -> Handle`

Opens an auxiliary UART with platform default pins.

**Example**

```frothy
aux is uart.open: 1, $baud_115200
```

---

<a id="uart-open-on"></a>
**`uart.open-on`** *(uart)* `(port, tx, rx, baud) -> Handle`

Opens an auxiliary UART on caller-picked TX and RX pins.

**Example**

```frothy
aux is uart.open-on: 1, 17, 16, $baud_115200
```

---

<a id="uart-write-byte"></a>
**`uart.write-byte`** *(uart)* `(handle, byte) -> nil`

Writes one byte to an auxiliary UART.

**Example**

```frothy
uart.write-byte: aux, 65
```

---

<a id="uart-read-byte"></a>
**`uart.read-byte`** *(uart)* `(handle) -> Int`

Reads one byte from an auxiliary UART, or `-1` when none is ready.

**Example**

```frothy
uart.read-byte: aux
```

---

<a id="uart-available"></a>
**`uart.available`** *(uart)* `(handle) -> Int`

Returns the count of bytes waiting on an auxiliary UART.

**Example**

```frothy
uart.available: aux
```

---

<a id="uart-close"></a>
**`uart.close`** *(uart)* `(handle) -> nil`

Closes an auxiliary UART and releases its handle.

**Example**

```frothy
uart.close: aux
```

---

<a id="i2c-open"></a>
**`i2c.open`** *(i2c)* `(port, sda, scl, freq) -> Handle`

Opens an I2C bus on a port with selected pins and frequency.

**Example**

```frothy
bus is i2c.open: 0, $sda, $scl, 400000
```

---

<a id="i2c-write"></a>
**`i2c.write`** *(i2c)* `(bus, addr, bytes) -> nil`

Writes bytes to a 7-bit I2C address.

**Example**

```frothy
i2c.write: bus, 104, "AT"
```

---

<a id="i2c-read"></a>
**`i2c.read`** *(i2c)* `(bus, addr, count) -> Bytes`

Reads `count` bytes from a 7-bit I2C address.

**Example**

```frothy
i2c.read: bus, 104, 2
```

---

<a id="i2c-close"></a>
**`i2c.close`** *(i2c)* `(bus) -> nil`

Closes an I2C bus and releases its handle.

**Example**

```frothy
i2c.close: bus
```

---

<a id="i2c-read-reg"></a>
**`i2c.read-reg`** *(i2c)* `(bus, addr, reg) -> Int`

Reads one byte from a register at a 7-bit I2C address.

**Example**

```frothy
i2c.read-reg: bus, 104, 117
```

---

<a id="i2c-read-reg16"></a>
**`i2c.read-reg16`** *(i2c)* `(bus, addr, reg) -> Int`

Reads a big-endian 16-bit register at a 7-bit I2C address.

**Example**

```frothy
i2c.read-reg16: bus, 104, 117
```

---

<a id="i2c-write-reg"></a>
**`i2c.write-reg`** *(i2c)* `(bus, addr, reg, value) -> nil`

Writes one byte to a register at a 7-bit I2C address.

**Example**

```frothy
i2c.write-reg: bus, 104, 107, 0
```

---

<a id="i2c-write-reg16"></a>
**`i2c.write-reg16`** *(i2c)* `(bus, addr, reg, value) -> nil`

Writes a big-endian 16-bit register at a 7-bit I2C address.

**Example**

```frothy
i2c.write-reg16: bus, 104, 107, 0
```

---

<a id="pwm-open"></a>
**`pwm.open`** *(pwm)* `(pin, freq) -> Handle`

Opens a PWM channel on a pin at a frequency in Hz.

**Example**

```frothy
led is pwm.open: $led_builtin, 1000
```

---

<a id="pwm-write"></a>
**`pwm.write`** *(pwm)* `(handle, duty) -> nil`

Sets PWM duty in the inclusive range `0` to `10000`.

**Example**

```frothy
pwm.write: led, 512
```

---

<a id="pwm-close"></a>
**`pwm.close`** *(pwm)* `(handle) -> nil`

Closes a PWM channel and releases its handle.

**Example**

```frothy
pwm.close: led
```

## Text, Bytes, Network, And Power

`Bytes` values live only for the current evaluation or loop iteration. They
cannot be installed in top-level names, Cells, or record fields. Consume them
directly, keep them in a `here` local during one call, or copy them into Text
with `text.pack`.

<a id="text-length"></a>
**`text.length`** *(text)* `(text) -> Int`

Returns the byte length of a text value.

**Example**

```frothy
text.length: "ready"
```

---

<a id="text-equals"></a>
**`text.equals?`** *(text)* `(a, b) -> Bool`

Returns true when two text values have equal bytes.

**Example**

```frothy
text.equals?: "ok", "ok"
```

---

<a id="text-concat"></a>
**`text.concat`** *(text)* `(a, b) -> Text`

Joins two text values into a new text value.

**Example**

```frothy
text.concat: "he", "llo"
```

---

<a id="text-at"></a>
**`text.at`** *(text)* `(text, index) -> Int`

Returns the byte at an index in a text value.

**Example**

```frothy
text.at: "A", 0
```

---

<a id="text-from-int"></a>
**`text.from-int`** *(text)* `(n) -> Text`

Renders an integer as decimal text.

**Example**

```frothy
text.from-int: 42
```

---

<a id="bytes-from-text"></a>
**`bytes.from-text`** *(bytes)* `(text) -> Bytes`

Copies a text value into a transient bytes buffer.

**Example**

```frothy
bytes.length: (bytes.from-text: "AT")
```

---

<a id="bytes-from-byte"></a>
**`bytes.from-byte`** *(bytes)* `(byte) -> Bytes`

Creates a one-byte buffer from a 0 to 255 integer.

**Example**

```frothy
bytes.from-byte: 65
```

---

<a id="bytes-from-int"></a>
**`bytes.from-int`** *(bytes)* `(n) -> Bytes`

Converts an integer to ASCII decimal bytes.

**Example**

```frothy
bytes.from-int: 42
```

---

<a id="bytes-length"></a>
**`bytes.length`** *(bytes)* `(buf) -> Int`

Returns the byte count of a bytes buffer.

**Example**

```frothy
bytes.length: buf
```

---

<a id="bytes-at"></a>
**`bytes.at`** *(bytes)* `(buf, index) -> Int`

Returns the byte at an index as a 0 to 255 integer.

**Example**

```frothy
bytes.at: buf, 0
```

---

<a id="bytes-equals"></a>
**`bytes.equals?`** *(bytes)* `(a, b) -> Bool`

Returns true when two bytes buffers have equal contents.

**Example**

```frothy
bytes.equals?: buf, bytes.from-text: "AT"
```

---

<a id="bytes-concat"></a>
**`bytes.concat`** *(bytes)* `(a, b) -> Bytes`

Concatenates two bytes buffers into a new buffer.

**Example**

```frothy
bytes.concat: bytes.from-text: "A", bytes.from-text: "T"
```

---

<a id="text-pack"></a>
**`text.pack`** *(text)* `(buf) -> Text`

Copies a bytes buffer into persistent text storage.

**Example**

```frothy
text.pack: buf
```

---

<a id="wifi-save"></a>
**`wifi.save`** *(network)* `(ssid, pass) -> nil`

Stores Wi-Fi credentials in the Frothy Wi-Fi NVS namespace.

**Example**

```frothy
wifi.save: "ssid", "password"
```

---

<a id="wifi-connect"></a>
**`wifi.connect`** *(network)* `() -> nil`

Connects Wi-Fi using stored credentials.

**Example**

```frothy
wifi.connect:
```

---

<a id="wifi-ready"></a>
**`wifi.ready?`** *(network)* `() -> Bool`

Returns true when Wi-Fi is connected.

**Example**

```frothy
wifi.ready?:
```

---

<a id="http-get"></a>
**`http.get`** *(network)* `(url) -> Bytes`

Fetches a URL and returns the response body up to the HTTP body cap.

**Example**

```frothy
http.get: "http://example.com/"
```

---

<a id="tcp-open"></a>
**`tcp.open`** *(network)* `(host, port) -> Handle`

Opens a TCP connection to a host and port.

**Example**

```frothy
sock is tcp.open: "example.com", 80
```

---

<a id="tcp-read"></a>
**`tcp.read`** *(network)* `(sock, count) -> Bytes`

Reads up to `count` bytes from a TCP socket.

**Example**

```frothy
tcp.read: sock, 64
```

---

<a id="tcp-write"></a>
**`tcp.write`** *(network)* `(sock, bytes) -> nil`

Sends the raw bytes of a text or bytes value to a TCP socket.

**Example**

```frothy
tcp.write: sock, "ping"
```

---

<a id="tcp-close"></a>
**`tcp.close`** *(network)* `(sock) -> nil`

Closes a TCP socket and releases its handle.

**Example**

```frothy
tcp.close: sock
```

---

<a id="tcp-bytes-ready"></a>
**`tcp.bytes-ready?`** *(network)* `(sock) -> Int`

Returns the bytes available for immediate `tcp.read`.

**Example**

```frothy
tcp.bytes-ready?: sock
```

---

<a id="watchdog-arm"></a>
**`watchdog.arm`** *(power)* `(timeout_ms) -> nil`

Arms the watchdog with a timeout in milliseconds.

**Example**

```frothy
watchdog.arm: 5000
```

---

<a id="watchdog-feed"></a>
**`watchdog.feed`** *(power)* `() -> nil`

Feeds an already armed watchdog.

**Example**

```frothy
watchdog.feed:
```

---

<a id="sleep-deep"></a>
**`sleep.deep`** *(power)* `(ms) -> nil`

Enters deep sleep for a duration; the chip cold-boots on wake.

**Example**

```frothy
sleep.deep: 1000
```

---

<a id="sleep-wake-on-gpio"></a>
**`sleep.wake-on-gpio`** *(power)* `(pin, level) -> nil`

Configures GPIO wake for the next deep sleep.

**Example**

```frothy
sleep.wake-on-gpio: $boot_button, 0
```

## PAD

<a id="pad-reset"></a>
**`pad.reset`** *(pad)* `() -> nil`

Clears the transient pad buffer.

**Example**

```frothy
pad.reset:
```

---

<a id="pad-emit-byte"></a>
**`pad.emit-byte`** *(pad)* `(byte) -> nil`

Appends one byte to the transient pad buffer.

**Example**

```frothy
pad.emit-byte: 65
```

---

<a id="pad-len"></a>
**`pad.len`** *(pad)* `() -> Int`

Returns the transient pad buffer length.

**Example**

```frothy
pad.len:
```

---

<a id="pad-type"></a>
**`pad.type`** *(pad)* `() -> nil`

Writes the transient pad buffer to console output.

**Example**

```frothy
pad.type:
```

---

<a id="pad-peek-byte"></a>
**`pad.peek-byte`** *(pad)* `(index) -> Int`

Reads one byte from the transient pad buffer.

**Example**

```frothy
pad.peek-byte: 0
```

---

<a id="pad-pack"></a>
**`pad.pack`** *(pad)* `() -> Text`

Packs the transient pad bytes into a text value.

**Example**

```frothy
pad.pack:
```

---

## Trace And Pulse

### Digital Trace

<a id="trace-open"></a>
**`trace.open`** *(trace)* `() -> Handle`

Opens the single bounded digital-edge capture.

**Example**

```frothy
capture is trace.open:
```

---

<a id="trace-watch"></a>
**`trace.watch`** *(trace)* `(capture, pin) -> Int`

Adds a pin to a capture and returns its channel index from 0 through 2.

**Example**

```frothy
scl-channel is trace.watch: capture, $scl
```

---

<a id="trace-arm"></a>
**`trace.arm`** *(trace)* `(capture) -> nil`

Clears previous edges and arms the configured capture.

**Example**

```frothy
trace.arm: capture
```

---

<a id="trace-wait"></a>
**`trace.wait`** *(trace)* `(capture, timeout_ms) -> Bool`

Waits interruptibly and returns true when the capture completes before the
timeout.

**Example**

```frothy
trace.wait: capture, 1000
```

---

<a id="trace-stop"></a>
**`trace.stop`** *(trace)* `(capture) -> nil`

Finishes an armed capture immediately so its collected edges can be read.

**Example**

```frothy
trace.stop: capture
```

---

<a id="trace-count"></a>
**`trace.count`** *(trace)* `(capture) -> Int`

Returns the number of captured edges.

**Example**

```frothy
trace.count: capture
```

---

<a id="trace-channel"></a>
**`trace.channel`** *(trace)* `(capture, index) -> Int`

Returns the watched-channel index for one captured edge.

**Example**

```frothy
trace.channel: capture, 0
```

---

<a id="trace-level"></a>
**`trace.level`** *(trace)* `(capture, index) -> Int`

Returns the pin level after one captured edge.

**Example**

```frothy
trace.level: capture, 0
```

---

<a id="trace-delta-ns"></a>
**`trace.delta-ns`** *(trace)* `(capture, index) -> Int`

Returns nanoseconds since the previous captured edge.

**Example**

```frothy
trace.delta-ns: capture, 1
```

---

<a id="trace-complete"></a>
**`trace.complete?`** *(trace)* `(capture) -> Bool`

Returns true when capture stopped, filled its edge buffer, or reached its
maximum span.

**Example**

```frothy
trace.complete?: capture
```

---

<a id="trace-dump"></a>
**`trace.dump`** *(trace)* `(capture) -> nil`

Prints the watched pins and captured edges for direct inspection.

**Example**

```frothy
trace.dump: capture
```

---

<a id="trace-close"></a>
**`trace.close`** *(trace)* `(capture) -> nil`

Releases the trace capture handle.

**Example**

```frothy
trace.close: capture
set capture to nil
```

### Timed Pulse Output

<a id="pulse-open"></a>
**`pulse.open`** *(pulse)* `(pin, idle_level) -> Handle`

Opens the single timed digital output with idle level 0 or 1.

**Example**

```frothy
wave is pulse.open: 4, 0
```

---

<a id="pulse-add"></a>
**`pulse.add`** *(pulse)* `(wave, level, duration_ns) -> Int`

Appends one 100-nanosecond-quantized span and returns its actual duration.

**Example**

```frothy
pulse.add: wave, 1, 800
```

---

<a id="pulse-clear"></a>
**`pulse.clear`** *(pulse)* `(wave) -> nil`

Clears all spans while keeping the output open.

**Example**

```frothy
pulse.clear: wave
```

---

<a id="pulse-count"></a>
**`pulse.count`** *(pulse)* `(wave) -> Int`

Returns the number of waveform spans.

**Example**

```frothy
pulse.count: wave
```

---

<a id="pulse-level"></a>
**`pulse.level`** *(pulse)* `(wave, index) -> Int`

Returns a waveform span's level.

**Example**

```frothy
pulse.level: wave, 0
```

---

<a id="pulse-duration-ns"></a>
**`pulse.duration-ns`** *(pulse)* `(wave, index) -> Int`

Returns a waveform span's actual quantized duration.

**Example**

```frothy
pulse.duration-ns: wave, 0
```

---

<a id="pulse-dump"></a>
**`pulse.dump`** *(pulse)* `(wave) -> nil`

Prints the quantized waveform.

**Example**

```frothy
pulse.dump: wave
```

---

<a id="pulse-play"></a>
**`pulse.play`** *(pulse)* `(wave) -> nil`

Transmits the waveform once and returns after playback completes.

**Example**

```frothy
pulse.play: wave
```

---

<a id="pulse-close"></a>
**`pulse.close`** *(pulse)* `(wave) -> nil`

Releases the timed output handle.

**Example**

```frothy
pulse.close: wave
set wave to nil
```

## Console Routing

<a id="console-uart"></a>
**`console.uart`** *(console)* `(tx, rx, baud) -> nil`

Moves the active REPL to caller-selected UART pins and a literal baud rate.

**Example**

```frothy
console.uart: 17, 16, 115200
```

---

<a id="console-default"></a>
**`console.default`** *(console)* `() -> nil`

Restores the board's default boot and recovery console.

**Example**

```frothy
console.default:
```

---

<a id="console-info"></a>
**`console.info`** *(console)* `() -> nil`

Prints the active console route.

**Example**

```frothy
console.info:
```

## Bluetooth

### Radio

<a id="ble-on"></a>
**`ble.on`** *(ble)* `() -> nil`

Initializes the compiled BLE roles and waits for radio readiness.

**Example**

```frothy
ble.on:
```

---

<a id="ble-info"></a>
**`ble.info`** *(ble)* `() -> nil`

Prints BLE roles, radio state, scan and advertising state, connection pressure,
and the last raw failure reason.

**Example**

```frothy
ble.info:
```

---

<a id="ble-off"></a>
**`ble.off`** *(ble)* `() -> nil`

Closes BLE links, clears queues, invalidates BLE handles, and shuts down the
radio.

**Example**

```frothy
ble.off:
```

### Scanning

<a id="ble-scan-start"></a>
**`ble.scan.start`** *(ble scan)* `(interval_ms, window_ms, active, repeats, minimum_rssi) -> nil`

Starts an indefinite BLE scan with bounded interval/window timing, active and
duplicate-report flags, and an RSSI floor.

**Example**

```frothy
ble.scan.start: 100, 50, 1, 0, -90
```

---

<a id="ble-scan-stop"></a>
**`ble.scan.stop`** *(ble scan)* `() -> nil`

Stops scanning while retaining reports already queued.

**Example**

```frothy
ble.scan.stop:
```

---

<a id="ble-scan-next"></a>
**`ble.scan.next?`** *(ble scan)* `() -> Bool`

Selects the next queued report and returns whether one was available.

**Example**

```frothy
when ble.scan.next?: [ ble.scan.rssi: ]
```

---

<a id="ble-scan-rssi"></a>
**`ble.scan.rssi`** *(ble scan)* `() -> Int`

Returns the current report's RSSI in dBm.

**Example**

```frothy
ble.scan.rssi:
```

---

<a id="ble-scan-peer"></a>
**`ble.scan.peer`** *(ble scan)* `() -> Bytes`

Returns the current peer as one address-type byte followed by its six canonical
address bytes.

**Example**

```frothy
bytes.length: (ble.scan.peer:)
```

---

<a id="ble-scan-flags"></a>
**`ble.scan.flags`** *(ble scan)* `() -> Int`

Returns the current report's platform scan flags.

**Example**

```frothy
ble.scan.flags:
```

---

<a id="ble-scan-data"></a>
**`ble.scan.data`** *(ble scan)* `() -> Bytes`

Copies the current raw advertisement payload.

**Example**

```frothy
ble.scan.data:
```

### Advertising

<a id="ble-advertise-start"></a>
**`ble.advertise.start`** *(ble advertise)* `(advertising_data, scan_response_data, interval_ms, connectable) -> nil`

Starts legacy advertising with raw Text or Bytes AD payloads and a connectable
flag of 0 or 1.

**Example**

```frothy
ble.advertise.start: "\x02\x01\x06", "\x07\x09Frothy", 100, 1
```

---

<a id="ble-advertise-stop"></a>
**`ble.advertise.stop`** *(ble advertise)* `() -> nil`

Stops active BLE advertising.

**Example**

```frothy
ble.advertise.stop:
```

### Connections

<a id="ble-connect"></a>
**`ble.connect`** *(ble connection)* `(peer, timeout_ms) -> Handle`

Connects to a peer returned by `ble.scan.peer`.

**Example**

```frothy
link is ble.connect: peer, 5000
```

---

<a id="ble-accept"></a>
**`ble.accept`** *(ble connection)* `() -> Handle|nil`

Accepts one pending peripheral connection, or returns `nil` when none is
waiting.

**Example**

```frothy
link is ble.accept:
```

---

<a id="ble-connection-ready"></a>
**`ble.connection.ready?`** *(ble connection)* `(connection) -> Bool`

Returns whether a BLE connection handle is live.

**Example**

```frothy
ble.connection.ready?: link
```

---

<a id="ble-connection-close"></a>
**`ble.connection.close`** *(ble connection)* `(connection) -> nil`

Disconnects and releases a BLE connection handle.

**Example**

```frothy
ble.connection.close: link
set link to nil
```

---

<a id="ble-connection-info"></a>
**`ble.connection.info`** *(ble connection)* `(connection) -> nil`

Prints the peer, link parameters, security state, and raw disconnect reason.

**Example**

```frothy
ble.connection.info: link
```

---

<a id="ble-connection-rssi"></a>
**`ble.connection.rssi`** *(ble connection)* `(connection) -> Int`

Reads the live connection RSSI in dBm.

**Example**

```frothy
ble.connection.rssi: link
```

---

<a id="ble-connection-params"></a>
**`ble.connection.params`** *(ble connection)* `(connection, min_interval_ms, max_interval_ms, latency, supervision_timeout_ms) -> nil`

Requests bounded BLE connection parameters.

**Example**

```frothy
ble.connection.params: link, 15, 30, 0, 4000
```

---

<a id="ble-connection-mtu"></a>
**`ble.connection.mtu`** *(ble connection)* `(connection, requested_mtu, timeout_ms) -> Int`

Exchanges the ATT MTU and returns the actual negotiated value.

**Example**

```frothy
ble.connection.mtu: link, 128, 5000
```

### GATT Constants

<a id="ble-gatt-service"></a>
**`$ble.gatt.service`** *(gatt constant)* `Int`

Marks a local GATT table row as a service.

**Example**

```frothy
service is GattRow: $ble.gatt.service, "FFF0", $ble.gatt.primary, 0
```

---

<a id="ble-gatt-characteristic"></a>
**`$ble.gatt.characteristic`** *(gatt constant)* `Int`

Marks a local GATT table row as a characteristic.

**Example**

```frothy
value is GattRow: $ble.gatt.characteristic, "FFF1", $ble.gatt.read, 20
```

---

<a id="ble-gatt-primary"></a>
**`$ble.gatt.primary`** *(gatt constant)* `Int`

Marks a local GATT service as primary.

**Example**

```frothy
service is GattRow: $ble.gatt.service, "FFF0", $ble.gatt.primary, 0
```

---

<a id="ble-gatt-secondary"></a>
**`$ble.gatt.secondary`** *(gatt constant)* `Int`

Marks a local GATT service as secondary.

**Example**

```frothy
service is GattRow: $ble.gatt.service, "FFF0", $ble.gatt.secondary, 0
```

---

<a id="ble-gatt-read-flag"></a>
**`$ble.gatt.read`** *(gatt constant)* `Int`

Adds the readable property to a local characteristic.

**Example**

```frothy
$ble.gatt.read + $ble.gatt.notify
```

---

<a id="ble-gatt-write-flag"></a>
**`$ble.gatt.write`** *(gatt constant)* `Int`

Adds write-with-response support to a local characteristic.

**Example**

```frothy
$ble.gatt.read + $ble.gatt.write
```

---

<a id="ble-gatt-write-command"></a>
**`$ble.gatt.write-command`** *(gatt constant)* `Int`

Adds write-without-response support to a local characteristic.

**Example**

```frothy
flags is $ble.gatt.write-command
```

---

<a id="ble-gatt-notify-flag"></a>
**`$ble.gatt.notify`** *(gatt constant)* `Int`

Adds notification support to a local characteristic.

**Example**

```frothy
$ble.gatt.read + $ble.gatt.notify
```

---

<a id="ble-gatt-indicate-flag"></a>
**`$ble.gatt.indicate`** *(gatt constant)* `Int`

Adds indication support to a local characteristic.

**Example**

```frothy
$ble.gatt.read + $ble.gatt.indicate
```

---

<a id="ble-gatt-read-encrypted"></a>
**`$ble.gatt.read-encrypted`** *(gatt reserved constant)* `Int`

Names the encrypted-read flag. The current server installs the constant but
rejects security flags because pairing and encryption are not yet supported.

**Example**

```frothy
$ble.gatt.read-encrypted
```

---

<a id="ble-gatt-write-encrypted"></a>
**`$ble.gatt.write-encrypted`** *(gatt reserved constant)* `Int`

Names the encrypted-write flag; current GATT table installation rejects it.

**Example**

```frothy
$ble.gatt.write-encrypted
```

---

<a id="ble-gatt-read-authenticated"></a>
**`$ble.gatt.read-authenticated`** *(gatt reserved constant)* `Int`

Names the authenticated-read flag; current GATT table installation rejects it.

**Example**

```frothy
$ble.gatt.read-authenticated
```

---

<a id="ble-gatt-write-authenticated"></a>
**`$ble.gatt.write-authenticated`** *(gatt reserved constant)* `Int`

Names the authenticated-write flag; current GATT table installation rejects it.

**Example**

```frothy
$ble.gatt.write-authenticated
```

---

<a id="ble-gatt-notifications"></a>
**`$ble.gatt.notifications`** *(gatt constant)* `Int`

Selects notification mode for a remote GATT subscription.

**Example**

```frothy
ble.gatt.subscribe: link, attribute, $ble.gatt.notifications, 5000
```

---

<a id="ble-gatt-indications"></a>
**`$ble.gatt.indications`** *(gatt constant)* `Int`

Selects indication mode for a remote GATT subscription.

**Example**

```frothy
ble.gatt.subscribe: link, attribute, $ble.gatt.indications, 5000
```

### Local GATT Server

<a id="ble-gatt-install"></a>
**`ble.gatt.install`** *(gatt server)* `(rows) -> nil`

Validates and copies a declarative Cells table of GATT service and
characteristic records while the radio is off.

**Example**

```frothy
ble.gatt.install: gatt_rows
```

---

<a id="ble-gatt-info"></a>
**`ble.gatt.info`** *(gatt)* `() -> nil`

Prints local-server and remote-client GATT state, capacities, queues, and raw
errors.

**Example**

```frothy
ble.gatt.info:
```

---

<a id="ble-gatt-set"></a>
**`ble.gatt.set`** *(gatt server)* `(attribute, data) -> nil`

Replaces a local characteristic value by source-row attribute ID.

**Example**

```frothy
ble.gatt.set: 1, "ready"
```

---

<a id="ble-gatt-get"></a>
**`ble.gatt.get`** *(gatt server)* `(attribute) -> Bytes`

Copies a local characteristic value by source-row attribute ID.

**Example**

```frothy
ble.gatt.get: 1
```

---

<a id="ble-gatt-notify"></a>
**`ble.gatt.notify`** *(gatt server)* `(connection, attribute, data) -> nil`

Sends one subscribed notification.

**Example**

```frothy
ble.gatt.notify: link, 1, "awake"
```

---

<a id="ble-gatt-indicate"></a>
**`ble.gatt.indicate`** *(gatt server)* `(connection, attribute, data, timeout_ms) -> nil`

Sends an indication and waits interruptibly for its acknowledgement.

**Example**

```frothy
ble.gatt.indicate: link, 1, "awake", 5000
```

---

<a id="ble-gatt-next-write"></a>
**`ble.gatt.next-write`** *(gatt server)* `() -> Handle|nil`

Selects the next accepted remote write and returns its connection, or `nil`
when the queue is empty.

**Example**

```frothy
when ble.gatt.next-write: [ ble.gatt.write-data: ]
```

---

<a id="ble-gatt-write-attribute"></a>
**`ble.gatt.write-attribute`** *(gatt server)* `() -> Int`

Returns the source-row attribute ID for the selected remote write.

**Example**

```frothy
ble.gatt.write-attribute:
```

---

<a id="ble-gatt-write-data"></a>
**`ble.gatt.write-data`** *(gatt server)* `() -> Bytes`

Copies the selected remote write's data.

**Example**

```frothy
ble.gatt.write-data:
```

### Remote GATT Client

<a id="ble-gatt-find"></a>
**`ble.gatt.find`** *(gatt client)* `(connection, service_uuid, characteristic_uuid, timeout_ms) -> Int`

Finds one remote characteristic and returns its ATT handle.

**Example**

```frothy
battery is ble.gatt.find: link, "180F", "2A19", 5000
```

---

<a id="ble-gatt-read"></a>
**`ble.gatt.read`** *(gatt client)* `(connection, attribute, timeout_ms) -> Bytes`

Reads one short remote characteristic value.

**Example**

```frothy
ble.gatt.read: link, battery, 5000
```

---

<a id="ble-gatt-write"></a>
**`ble.gatt.write`** *(gatt client)* `(connection, attribute, data, with_response, timeout_ms) -> nil`

Writes one short remote characteristic value. Use 1 for a response and 0 for a
write command.

**Example**

```frothy
ble.gatt.write: link, battery, (bytes.from-byte: 42), 1, 5000
```

---

<a id="ble-gatt-subscribe"></a>
**`ble.gatt.subscribe`** *(gatt client)* `(connection, attribute, mode, timeout_ms) -> nil`

Subscribes to remote notifications or indications.

**Example**

```frothy
ble.gatt.subscribe: link, battery, $ble.gatt.notifications, 5000
```

---

<a id="ble-gatt-unsubscribe"></a>
**`ble.gatt.unsubscribe`** *(gatt client)* `(connection, attribute, timeout_ms) -> nil`

Unsubscribes from one remote characteristic.

**Example**

```frothy
ble.gatt.unsubscribe: link, battery, 5000
```

---

<a id="ble-gatt-next-notification"></a>
**`ble.gatt.next-notification`** *(gatt client)* `() -> Handle|nil`

Selects the next remote notification and returns its connection, or `nil` when
the queue is empty.

**Example**

```frothy
when ble.gatt.next-notification: [ ble.gatt.notification-data: ]
```

---

<a id="ble-gatt-notification-attribute"></a>
**`ble.gatt.notification-attribute`** *(gatt client)* `() -> Int`

Returns the ATT handle for the selected remote notification.

**Example**

```frothy
ble.gatt.notification-attribute:
```

---

<a id="ble-gatt-notification-data"></a>
**`ble.gatt.notification-data`** *(gatt client)* `() -> Bytes`

Copies the selected remote notification data.

**Example**

```frothy
ble.gatt.notification-data:
```

## Internal Event Support

<a id="frothy-event-register"></a>
**`frothy.event-register`** *(internal)* `(kind, source, debounce, body) -> nil`

Internal native used by compiled event registration forms.

**Example**

```frothy
to start-ticking [ every 1000 [ print: "tick" ] ]
```

---

<a id="frothy-event-cancel"></a>
**`frothy.event-cancel`** *(internal)* `(kind, source) -> nil`

Internal native used by compiled `cancel` forms.

**Example**

```frothy
cancel every 1000
```
