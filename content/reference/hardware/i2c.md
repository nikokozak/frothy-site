---
title: "I2C"
weight: 7
url: /reference/modules/i2c/
aliases:
  - /reference/hardware/i2c/
description: "Open an I2C bus, exchange raw bytes, use register helpers, and manage the live handle safely."
icon: cable
tags: [i2c, sensors, bytes]
---

I2C is the usual path to small sensors, displays, and converters. Frothy keeps
the bus itself explicit: open it once, pass its `Handle` to each transfer, and
close it when the project no longer needs it.

## Read A Sensor Register

The following shape works for devices with an 8-bit identity register. Replace
the address and register with values from the device datasheet.

```frothy
bus is i2c.open: 0, $sda, $scl, 400000
identity is i2c.read-reg: bus, 104, 117
i2c.close: bus
set bus to nil
```

`104` is the decimal form of 7-bit address `0x68`; `117` is register `0x75`.
Frothy integer literals are decimal, so convert hexadecimal datasheet values
before entering them.

## Word Table

| Word | Result | Use |
| --- | --- | --- |
| [`i2c.open`](/reference/words/#i2c-open) | `Handle` | Open a port on selected SDA/SCL pins and frequency |
| [`i2c.write`](/reference/words/#i2c-write) | `nil` | Send Text or Bytes to a 7-bit address |
| [`i2c.read`](/reference/words/#i2c-read) | `Bytes` | Read a transient byte buffer |
| [`i2c.read-reg`](/reference/words/#i2c-read-reg) | `Int` | Read one 8-bit register |
| [`i2c.write-reg`](/reference/words/#i2c-write-reg) | `nil` | Write one 8-bit register |
| [`i2c.read-reg16`](/reference/words/#i2c-read-reg16) | `Int` | Read one big-endian 16-bit register |
| [`i2c.write-reg16`](/reference/words/#i2c-write-reg16) | `nil` | Write one big-endian 16-bit register |
| [`i2c.close`](/reference/words/#i2c-close) | `nil` | Close the bus and release its handle |

## Open And Close

```frothy
bus is i2c.open: 0, $sda, $scl, 100000
-- transfers go here
i2c.close: bus
set bus to nil
```

The board constants `$sda` and `$scl` select the default pins. Use numeric pin
values when a circuit is wired elsewhere. Common frequencies are `100000` and
`400000` Hz, subject to the devices, wiring, pull-ups, and target support.

`i2c.open` returns a live runtime `Handle`, not an integer port number. A closed
or stale handle cannot be reused.

## Raw Transfers

`i2c.write` accepts Text or Bytes, so short fixed command sequences can be
written directly:

```frothy
i2c.write: bus, 104, "AT"

to inspect-reply [
  here reply is i2c.read: bus, 104, 2
  bytes.at: reply, 0
  bytes.at: reply, 1
]

inspect-reply:
```

`i2c.read` returns transient `Bytes`. Copy a reading into persistent Text before
the current evaluation ends or when the value must survive a save:

```frothy
saved-reply is text.pack: (i2c.read: bus, 104, 2)
```

The `count`, address, register, and register values must fit their respective
byte or 16-bit ranges. A device NACK, invalid address, unavailable port, or bus
failure is reported as an error.

## Register Helpers

The register words perform the common write-register-then-read transaction:

```frothy
i2c.write-reg: bus, 104, 107, 0
who-am-i is i2c.read-reg: bus, 104, 117

i2c.write-reg16: bus, 72, 1, 32768
config is i2c.read-reg16: bus, 72, 1
```

The 16-bit helpers use big-endian byte order. If a component uses little-endian
values, multi-byte register addresses, repeated-start rules outside this
contract, or a larger transaction, compose it with raw `i2c.write` and
`i2c.read` instead.

## Persistence Pattern

Handles are volatile and make `save` fail while stored in a project slot. Keep
the durable binding non-handle, open the bus at boot, and explicitly release it
before saving:

```frothy
bus is false

to sensor.open [
  set bus to i2c.open: 0, $sda, $scl, 400000
]

to sensor.close [
  i2c.close: bus
  set bus to false
]

boot is fn [ sensor.open: ]
```

See [Text, Bytes & PAD](/reference/modules/text-bytes-pad/) for byte lifetimes
and [Board constants & helpers](/reference/modules/board/) for the named pins.
