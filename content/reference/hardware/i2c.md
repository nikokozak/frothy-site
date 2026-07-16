---
title: "I2C"
weight: 9
description: "Source-board I2C bus, byte, and register words."
advanced: true
---

I2C is an ESP32 peripheral surface. It is useful for sensors and small external
devices, but it is not part of the first LED/button path.

## Availability

The bundled `esp32_devkit_v1` and `seeed_xiao_esp32s3` board sources expose I2C
bindings and board-selected `$sda` and `$scl` pins. Treat this as an advanced
hardware page, not the first thing to try.

`i2c.open` returns a Handle: a tagged Frothy value that names a live runtime
handle-table entry. It is neither an integer nor an ESP-IDF pointer.

## Bus

**`i2c.open:`** *(i2c)* `(port, sda, scl, freq) -> Handle`

Opens a bus on a port with the `$sda` and `$scl` pins at a frequency and
returns a bus handle.

```frothy
bus is i2c.open: 0, $sda, $scl, 400000
```

**`i2c.close:`** *(i2c)* `(bus) -> nil`

Releases a bus handle.

```frothy
i2c.close: bus
```

## Byte I/O

Bytes are addressed to a 7-bit device address on the bus.

**`i2c.write:`** *(i2c)* `(bus, addr, bytes) -> nil`

Writes a byte payload to a device.

```frothy
i2c.write: bus, 104, "AT"
```

**`i2c.read:`** *(i2c)* `(bus, addr, count) -> Bytes`

Reads `count` bytes from a device into a transient Bytes value.

```frothy
i2c.read: bus, 104, 2
```

Pack the result into Text when you need a persistent copy:

```frothy
reply is text.pack: (i2c.read: bus, 104, 2)
```

## Register I/O

**`i2c.write-reg:`** *(i2c)* `(bus, addr, reg, value) -> nil`

Writes one byte to a register.

```frothy
i2c.write-reg: bus, 104, 107, 0
```

**`i2c.read-reg:`** *(i2c)* `(bus, addr, reg) -> Int`

Reads one byte from a register.

```frothy
i2c.read-reg: bus, 104, 117
```

**`i2c.write-reg16:`** *(i2c)* `(bus, addr, reg, value) -> nil`

Writes a 16-bit register value.

```frothy
i2c.write-reg16: bus, 104, 107, 0
```

**`i2c.read-reg16:`** *(i2c)* `(bus, addr, reg) -> Int`

Reads a 16-bit register value.

```frothy
i2c.read-reg16: bus, 104, 117
```

## Notes

Keep setup in one named place:

```frothy
bus is false -- no bus is open yet

to sensor.setup [
  set bus to i2c.open: 0, $sda, $scl, 400000
]

boot is fn [ sensor.setup: ]
```

Handles are volatile. `save` is rejected while an overlay slot holds one. Close
the bus and set `bus` back to `false` before saving; `boot` can open a fresh bus
after restore.
