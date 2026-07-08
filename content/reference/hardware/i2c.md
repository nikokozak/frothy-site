---
title: "I2C"
weight: 9
description: "Source-board I2C bus, byte, and register words."
advanced: true
---

I2C is a ESP32 peripheral surface. It is useful for sensors and small external devices, but it is not part of the first LED/button path.

## Availability

The `esp32_devkit_v1` board source exposes I2C bindings. Treat this as an advanced hardware page, not the first thing to try.

Handles are small integers returned by setup words and passed back into later
calls. Native ESP-IDF pointers do not become Frothy values.

## Bus

**`i2c.open:`** *(i2c)* `(port, sda, scl, freq) -> Int`

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

**`i2c.read:`** *(i2c)* `(bus, addr, count) -> Text`

Reads `count` bytes from a device.

```frothy
i2c.read: bus, 104, 2
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
bus is nil

to sensor.setup [
  set bus to i2c.open: 0, $sda, $scl, 400000
]
```

Do not save native assumptions. The saved overlay may remember the small
integer handles, but hardware should be initialized from `boot` after restore.
