---
title: "I2C"
weight: 9
description: "Source-board I2C bus, device, probe, byte, and register words."
advanced: true
---

I2C is a ESP32 peripheral surface. It is useful for sensors and small external devices, but it is not part of the first LED/button path.

## Availability

The `esp32_devkit_v1` board source exposes I2C bindings. Treat this as an advanced hardware page, not the first thing to try.

Handles are small integers returned by setup words and passed back into later
calls. Native ESP-IDF pointers do not become Frothy values.

## Bus And Device

**`i2c.init:`** `(sda, scl, freq) -> Int`

Creates a bus handle.

```frothy
i2c.bus is i2c.init: SDA, SCL, 400000
```

**`i2c.add-device:`** `(bus, addr, speed) -> Int`

Adds one 7-bit-addressed device and returns a device handle.

```frothy
i2c.dev is i2c.add-device: i2c.bus, 104, 400000
```

**`i2c.rm-device:`** `(device) -> nil`

Releases a device handle.

**`i2c.del-bus:`** `(bus) -> nil`

Releases a bus handle.

## Probe And Byte I/O

**`i2c.probe:`** `(bus, addr) -> Bool`

Checks whether one address responds.

```frothy
i2c.probe: i2c.bus, 104
```

**`i2c.write-byte:`** `(device, byte) -> nil`

Writes one byte.

**`i2c.read-byte:`** `(device) -> Int`

Reads one byte.

## Register I/O

**`i2c.write-reg:`** `(byte, device, reg) -> nil`

Writes one byte to a register.

```frothy
i2c.write-reg: 0, i2c.dev, 107
```

**`i2c.read-reg:`** `(device, reg) -> Int`

Reads one byte from a register.

```frothy
i2c.read-reg: i2c.dev, 117
```

**`i2c.read-reg16:`** `(device, reg) -> Int`

Reads a 16-bit register value.

## Notes

Keep setup in one named place:

```frothy
i2c.bus is nil
i2c.dev is nil

to sensor.setup [
  set i2c.bus to i2c.init: SDA, SCL, 400000;
  set i2c.dev to i2c.add-device: i2c.bus, 104, 400000
]
```

Do not save native assumptions. The saved overlay may remember the small
integer handles, but hardware should be initialized from `boot` after restore.
