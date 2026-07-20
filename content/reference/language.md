---
title: "Frothy in Y Minutes"
weight: 1
description: "The complete Frothy language in one runnable, example-first page: values, words, state, control flow, records, errors, events, persistence, and the prompt."
aliases:
  - /reference/ten-minutes/
icon: braces
tags: [language, syntax, semantics, examples]
guideTopic: true
---

Frothy is a small live language for programmable devices. You send it source,
the device installs that source into its current image, and you can inspect,
replace, save, and run the result without rebuilding firmware.

This is the whole language, from the first expression to the edges of the
current ESP32 profile. Read it top to bottom once, then use the [word
catalog](/reference/words/) when you only need a signature.

## The Thirty-Second Version

```frothy
counter is 0

to blink-and-count with pin, wait [
  gpio.high: pin
  ms: wait
  gpio.low: pin
  set counter to counter + 1
  counter
]

blink-and-count: $led_builtin, 75
save
```

That sample contains most of the model:

- `counter is 0` binds a top-level name to a value.
- `to ... [ ... ]` defines a word. Other languages usually say “function.”
- `with pin, wait` declares parameters.
- `gpio.high: pin` calls a word with `:`.
- Newlines separate expressions inside a block.
- The last expression is the block's result.
- `set` changes an existing place.
- `save` persists the user image.

## Comments

A line comment begins with two hyphens and ends at the newline.

```frothy
led.on: -- the rest of this line is ignored
```

A block comment begins with `-*` and ends with `*-`.

```frothy
-*
This can span
several lines.
*-
led.off:
```

Comments are recognized after whitespace or punctuation that can precede a
comment. Hyphens may also be part of names, so this remains one name:

```frothy
read-next-byte
```

## Integers And Arithmetic

Frothy has integers, not floating-point numbers. Decimal, hexadecimal, and
binary literals are accepted.

```frothy
42
-7
0x2a
0b101010
```

On the current 32-bit ESP32 profile, integers range from `-1073741824` through
`1073741823`. An out-of-range literal or arithmetic result is an error; values
do not silently wrap.

The arithmetic operators are `+`, `-`, `*`, `/`, and `%`.

```frothy
2 * 3 + 4        -- 10
(2 + 3) * 4      -- 20
37 % 10          -- 7
```

`*`, `/`, and `%` bind more tightly than `+` and `-`. Operators at the same
precedence associate from left to right. Division by zero is an error.

`%` and the word `mod` use C-style truncating remainder semantics. The
[math module](/reference/modules/math-and-random/) also provides `abs`, `min`,
`max`, `clamp`, `map`, and integer `sqrt`.

## Comparisons And Boolean Logic

Integer comparisons use `<`, `>`, `<=`, `>=`, `=`, and `<>`.

```frothy
2 < 3            -- true
10 >= 10         -- true
4 <> 5           -- true
```

`not`, `and`, and `or` use Frothy truthiness and produce `Bool` results.
`and` and `or` short-circuit, so the right side only runs when needed.

```frothy
not false                       -- true
2 > 1 and 3 < 4                 -- true
ready or attempt-connect:       -- skips the call when ready is truthy
```

Precedence, from tightest to loosest, is:

1. `not`
2. `*`, `/`, `%`
3. `+`, `-`
4. `<`, `>`, `<=`, `>=`, `=`, `<>`
5. `and`
6. `or`

Use parentheses when the grouping is not immediately obvious.

## Values

The current ESP32 profile exposes these value families:

| Value | Example | Lifetime |
| --- | --- | --- |
| `Nil` | `nil` | persistable |
| `Bool` | `true`, `false` | persistable |
| `Int` | `42`, `0xff` | persistable |
| `Text` | `"ready"` | persistable |
| `Code` | `fn [ 1 + 2 ]` | persistable |
| `Cells` | `cells(4)` | persistable mutable storage |
| record shape/value | `record Point [ x, y ]` | persistable |
| `Bytes` | `bytes.from-text: "AT"` | transient |
| `Handle` | `i2c.open: ...` | transient |

Only `nil`, `false`, and integer `0` are falsy. Every other value is truthy,
including empty text.

```frothy
if 5 [ "yes" ] else [ "no" ]       -- "yes"
if 0 [ "yes" ] else [ "no" ]       -- "no"
if nil [ "yes" ] else [ "no" ]     -- "no"
```

`0x10` is the integer `16`; it is not a byte buffer. Create `Bytes` explicitly
with a `bytes.*` word or an I/O operation that returns bytes.

Square brackets delimit bodies used by language forms. A standalone `[ 1 + 2
]` is not a `Code` literal; use `fn [ 1 + 2 ]`.

## Text

Text is immutable and byte-oriented. A literal is enclosed in double quotes.

```frothy
greeting is "hello"
print: greeting
text.length: greeting       -- 5
text.at: greeting, 1        -- 101, the byte for e
```

The supported escapes are:

| Escape | Meaning |
| --- | --- |
| `\n` | newline |
| `\r` | carriage return |
| `\t` | tab |
| `\"` | double quote |
| `\\` | backslash |
| `\xNN` | one byte written as two hexadecimal digits |

```frothy
print: "first\nsecond\n"
packet is "\x02\x01\x06"
```

Text cannot contain a literal source newline. Use `\n`. The current ESP32
profile allows an individual text value up to 4096 bytes and an 8192-byte text
pool across the live image.

Use [Text, Bytes & PAD](/reference/modules/text-bytes-pad/) for conversion and
transient-buffer rules.

## Names

Names are intentionally permissive. Dots, hyphens, question marks, underscores,
and exclamation marks are ordinary name characters.

```frothy
sensor.ready?
read-next-byte
all_my.friends!
```

Whitespace and syntax punctuation end a name. A name cannot contain `(`, `)`,
`[`, `]`, `,`, `:`, `;`, `+`, `*`, `/`, `%`, comparison operators, or `->`.
A hyphen stays inside a name unless it is clearly subtraction or the start of a
negative integer.

```frothy
x - y       -- subtraction; spaces make the intent clear
x-y         -- one name
```

Names are case-sensitive. The current profile permits up to 48 bytes per name.
Language keywords cannot be used in positions where they would be ambiguous.

## Top-Level Bindings

Bind a top-level name with `is`.

```frothy
count is 10
message is "ready"
```

Running another `is` definition for the same name rebinds its stable slot.

```frothy
count is 20
```

Use `set` when the intent is mutation rather than replacement of a definition.

```frothy
set count to count + 1
```

`set` only changes an existing name or place. It does not create one.

A top-level `is` definition accepts literals, an existing name, `fn`, `cells`,
a record value, or the result of a word call. An operator or control-flow
expression is evaluated with `set` after the place exists:

```frothy
total is 0
set total to 20 + 22
```

This boundary keeps image installation explicit. A call result may be bound
when its value kind is slot-safe; `Bytes` is the exception and must be packed
to Text first.

## Words And Calls

Frothy calls functions “words.” Define a word with `to` and call it with a
colon.

```frothy
to add-three [ 1 + 2 ]
add-three:                       -- 3

to add with a, b [ a + b ]
add: 5, 9                        -- 14
```

A bare name reads its value. It does not call it.

```frothy
add          -- displays a Code value at the prompt
add: 5, 9    -- runs it
```

The last expression in a word body is its result.

```frothy
to describe with n [
  print: "value: "
  n
]
```

Arguments are comma-separated. Parenthesize a nested call when it makes the
argument boundary explicit.

```frothy
print: (text.from-int: 42)
total is add: 1, (add: 2, 3)
```

Calls are checked against the word's arity. Too few or too many arguments are
errors.

Words may call themselves recursively. The ESP32 profile currently allows 24
nested calls.

```frothy
to fib with n [
  if n < 2 [ n ] else [ fib: n - 1 + fib: n - 2 ]
]
```

## Code Values

`fn` creates a `Code` value. `to name ...` is the convenient top-level spelling
for binding that code to a name.

```frothy
double is fn with n [ n * 2 ]

to double with n [ n * 2 ]
```

Code can be rebound to another top-level name, and either name can call the
same code object.

```frothy
double is fn with n [ n * 2 ]
also-double is double
also-double: 21                 -- 42
```

Code is non-capturing. It can read its own parameters, locals declared in its
own body, and top-level names. It cannot capture a local from another word.

```frothy
wait is 50

-- This word can read the top-level wait.
to blink-once with pin [
  gpio.high: pin
  ms: wait
  gpio.low: pin
]
```

When a word needs a value that is not top-level, pass that value as an
argument. `fn` values themselves are currently installed from top-level
definitions; Frothy does not build closures inside a running word. Calls also
resolve a top-level word name: a Code value held only in a parameter, local,
Cell, or record field is not dynamically callable, and there is no separate
`call` word.

## Parameters And Locals

Parameters are immutable. Declare a local with `here`, then mutate that local
with `set`.

```frothy
to countdown with start [
  here n is start
  while n > 0 [
    set n to n - 1
  ]
  n
]
```

Locals use lexical block scope. Lookup chooses the nearest local, then an outer
local, then a parameter, then a top-level name.

```frothy
speed is 100

to demo [
  here speed is 20
  if true [
    here speed is 5
    speed                 -- 5
  ]
  speed                   -- 20
]
```

The local declared inside the `if` block stops existing at its closing `]`.
The current profile allows 8 parameters and 16 locals in one parsed definition.

## Blocks And Expression Separation

A body is enclosed in `[ ... ]`. It must contain at least one expression.
Newlines separate expressions naturally.

```frothy
to pulse [
  led.on:
  ms: 50
  led.off:
]
```

A semicolon separates expressions on the same line.

```frothy
to pulse [ led.on:; ms: 50; led.off: ]
```

A trailing semicolon is allowed. In normal source, prefer newlines and use
semicolons only when a compact one-line form is clearer.

## Conditional Expressions

`if` chooses a block and returns that block's value.

```frothy
if temperature > 30 [ "hot" ] else [ "comfortable" ]
```

`else if` can be repeated.

```frothy
if percent > 80 [
  "high"
] else if percent > 50 [
  "medium"
] else [
  "low"
]
```

Without `else`, a false `if` yields `nil`. `when` is the one-sided positive
form; `unless` is the one-sided negative form.

```frothy
when wifi.ready?: [ print: "online\n" ]
unless wifi.ready?: [ print: "offline\n" ]
```

## Loops

`while` checks its condition before each pass.

```frothy
while count > 0 [
  set count to count - 1
]
```

`repeat` evaluates a count and runs a block that many times. A negative count is
an error. Add `as name` for a zero-based loop index.

```frothy
repeat 3 [ print: "tick\n" ]

repeat 3 as i [
  print: (text.from-int: i)
  print: "\n"
]
```

The index is a local scoped to the repeat body.

`forever` runs until the body errors or the evaluation is interrupted.

```frothy
forever [
  led.toggle:
  ms: 100
]
```

`while`, `repeat`, and `forever` yield `nil` when they finish normally.

## Cells

Cells are fixed-size mutable indexed storage. Create them at the top level with
a positive literal length.

```frothy
readings is cells(3)
```

New cells begin as `nil`. Indexes are zero-based.

```frothy
set readings[0] to 11
set readings[1] to 22
readings[0] + readings[1]       -- 33
```

An out-of-bounds index is an error. The current ESP32 profile allows up to 32
elements in one Cells value and 128 cell elements across the live image.

Cells and their persistable contents are included by `save`. Transient `Bytes`
and `Handle` values are rejected as cell contents.

## Records

Records give names to small fixed shapes. Declare a shape at the top level.

```frothy
record Point [ x, y ]
```

The declaration creates a constructor word with the same name. Construct a
record at the top level by calling it.

```frothy
point is Point: 3, 9
```

Read and write fields with `->`.

```frothy
point -> x                       -- 3
set point -> y to 12
```

Field names cannot contain dots. The current ESP32 profile permits 4 fields per
shape. Record construction inside a word body is not currently supported;
construct records at the top level and pass them into words.

Record shapes and values are persistable. Transient `Bytes` and `Handle` values
cannot be stored in record fields.

## Errors And Rescue

An error returns control to the prompt instead of wedging the device. A
diagnostic names the error and shows its numeric code. Reader and parser
diagnostics can also point at the offending source span.

```text
error: bad value: 0 (3)
```

Type, domain, and range failures include the value that was rejected. Extra
lines may identify the expected kind, native argument position, source span,
or valid bound. Values are escaped and bounded for the transcript, and secret
arguments are redacted. See [Error and notice codes](/errors/) for the full
wire shape and recovery table.

`attempt [ ... ] rescue [ ... ]` catches runtime errors.

```frothy
attempt [ 10 / divisor ] rescue [ 0 ]
```

If the attempt succeeds, the entire expression yields its value. If it fails,
Frothy restores the value stack to the beginning of the attempt, runs the
rescue block, and yields the rescue value.

Inside the rescue block, `error.code` and `error.name` describe the caught
error.

```frothy
to safe-divide with a, b [
  attempt [ a / b ] rescue [
    print: error.name
    error.code
  ]
]
```

Errors raised by called words can be caught by the caller's attempt. Parse and
compile errors happen before execution and cannot be caught. An interrupt is
also never catchable.

## Events

Event forms register code that the device runs at safe points. Registration
belongs inside a word body, not as a bare prompt expression.

Register a repeating or one-shot timer:

```frothy
to start-timers [
  every 1000 [ print: "tick\n" ]
  after 5000 [ led.off: ]
]
```

Register a GPIO edge handler:

```frothy
to watch-button [
  on $boot_button falling debounce 25 [
    led.toggle:
  ]
]
```

The edge is `rising`, `falling`, or `changes`. `debounce <ms>` is optional.

Wi-Fi exposes two event sources:

```frothy
to watch-network [
  on wifi.disconnected [ led.off: ]
  on wifi.reconnected [ led.on: ]
]
```

Cancel a registration with the same source identity:

```frothy
cancel every 1000
cancel after 5000
cancel $boot_button
cancel wifi.disconnected
```

For GPIO, cancellation uses the pin regardless of edge or debounce settings.
For timers, `every` and `after` are distinct and the millisecond value must
match. Event output appears as asynchronous `! ` lines at the prompt.

See the [events module](/reference/modules/events/) for lifecycle and capacity
details.

## Bytes And Handles

`Bytes` and `Handle` are real Frothy values, but they represent live working
state rather than saved project data.

`Bytes` is a transient byte buffer returned by words such as `i2c.read`,
`tcp.read`, `http.get`, and BLE reads.

```frothy
bytes.length: (http.get: "http://example.com/")
```

Bytes cannot be installed in top-level names, Cells, or record fields. A
`here` local can hold them during one word call. Copy bytes into persistent
Text when the content must survive the current evaluation or loop iteration:

```frothy
reply-text is text.pack: (http.get: "http://example.com/")
```

A `Handle` refers to an open platform resource such as I2C, UART, PWM, TCP,
trace, pulse, or BLE state.

```frothy
bus is i2c.open: 0, $sda, $scl, 400000
i2c.close: bus
set bus to nil
```

Handles are volatile. Close them and remove them from top-level project slots
before `save`. Reopen required resources from `boot` after restore.

## The Image, Save, And Boot

Frothy starts with a firmware-owned base image and adds your top-level bindings
to an overlay image.

```frothy
threshold is 500
to alarm [ when adc.read: $a0 > threshold [ led.on: ] ]
```

`save` writes the overlay to persistent storage. `restore` replaces the live
overlay with that saved overlay. `clear` removes the live overlay but leaves the
saved copy available. `dangerous.wipe` removes both.

```frothy
save
clear
restore
```

If the top-level `boot` slot holds Code after restore, Frothy runs it before
returning to the prompt.

```frothy
boot is fn [
  led.off:
  wifi.connect:
]
save
```

Safe boot lets a human interrupt restore/startup and recover a bad saved
program. The [image and persistence reference](/reference/device/image-and-persistence/)
covers the full lifecycle.

## The Prompt Is Part Of The Language Experience

The prompt evaluates expressions and installs definitions. It also provides
inspection commands without colons.

```frothy
words
see blink
status
events
mem
```

- `words` lists visible names.
- `see name` reconstructs a definition or describes a value.
- `status` reports the current session and runtime profile.
- `events` lists active event bindings.
- `mem` reports heap, slots, objects, and event capacity. Use `mem heap`, `mem
  slots`, `mem objects`, or `mem events` for one group.
- `clear` removes the live overlay and returns to the base image.

Host tooling also uses `apply HEX`, `run HEX`, `install-library`,
`install-user`, and `wipe-user`. They are prompt protocol or installation-tier
commands rather than source-language forms; their exact contracts are in the
[word catalog](/reference/words/#apply).

Press Ctrl-C to abandon incomplete multiline input or interrupt running code.
Frothy checks interrupts at safe points and returns the prompt to a usable
state.

## Source Files And Includes

A `.fr` file contains the same top-level definitions and expressions you type
at the prompt.

```frothy
to main [
  led.blink: 3, 75
]

main:
```

`include "helper.fr"` is a host-side `frothy` tool directive. The CLI resolves
it before sending source to the device. It is not device language syntax and
does not create a runtime word.

## What To Open Next

- [Word catalog](/reference/words/) — every current form, command, constant,
  helper, and ESP32 word in a searchable list.
- [Modules](/reference/modules/) — broad usage guides for GPIO, Wi-Fi, I2C,
  text, signals, BLE, and the rest of the built-in surface.
- [Device & sessions](/reference/device/) — prompt behavior, persistence,
  diagnostics, recovery, and tooling sessions.
- [Toolchain](/reference/toolchain/) — projects, source files, CLI commands,
  builds, flashing, and editor support.
