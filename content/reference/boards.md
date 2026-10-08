---
title: "Boards"
weight: 2
url: /boards/
description: "The boards that run Frothy, how each one connects, and the boards that do not work."
icon: cpu
tags: [boards, esp32, rp2040, hardware]
guideTopic: true
---

Frothy has official firmware for seven boards. Install it once with the
[browser flasher](https://app.frothy.dev/flash). Then program the board in the
[browser editor](https://app.frothy.dev/editor).

| Board | Chip | USB connection | `$led_builtin` | Radio |
| --- | --- | --- | --- | --- |
| ESP32 DevKit V1 | ESP32 | USB-to-UART chip | LED pin | Wi-Fi, Bluetooth LE |
| NodeMCU ESP-32S | ESP32 | USB-to-UART chip | `nil` | Wi-Fi, Bluetooth LE |
| Seeed Studio XIAO ESP32C3 | ESP32-C3 | USB Serial/JTAG | `nil` | Wi-Fi, Bluetooth LE |
| Seeed Studio XIAO ESP32C6 | ESP32-C6 | USB Serial/JTAG | LED pin | Wi-Fi, Bluetooth LE |
| Seeed Studio XIAO ESP32S3 | ESP32-S3 | USB Serial/JTAG | LED pin | Wi-Fi, Bluetooth LE |
| Seeed Studio XIAO RP2040 | RP2040 | native USB | LED pin | none |
| Arduino Nano RP2040 Connect | RP2040 | native USB | LED pin | Wi-Fi, Bluetooth LE |

All seven boards have `$a0`, `$sda` and `$scl`, and the ESP32 boards also have
`$boot_button`. Use these names, not pin numbers, and the same program runs on
more than one board. When `$led_builtin` is `nil`, the `led.*` words stop with
an error. Connect an LED to a pin, and use `gpio.write: pin, 1`.

The pins of these boards use 3.3 V. Do not connect a 5 V signal to a pin.

## ESP32 Boards

The flasher writes Frothy to an ESP32 board over USB. If it cannot connect,
start the board in download mode, as [Install](/install/#if-no-port-appears)
shows.

When an ESP32 board starts, it prints `boot: Ctrl-C or BOOT skips saved code`.
Press Ctrl-C or the BOOT button in the next 600 ms, and the board starts without
your saved program. Use this when your saved program does not let the prompt
appear.

The DevKit V1 and the NodeMCU ESP-32S connect through a USB-to-UART chip,
CP210x or CH340. On some computers, this chip needs a driver.

The XIAO ESP32C3, ESP32C6 and ESP32S3 connect through the USB Serial/JTAG unit
in the chip. This connection has no flow control. When you paste more than
about 1 KB into a terminal or `frothy connect`, the board can lose bytes with no
error. The editor and `frothy send` wait for the prompt after each form, so
they do not send too much at one time.

The XIAO ESP32C3 has no `trace.*` words.

## RP2040 Boards

For an RP2040 board, the flasher downloads a UF2 file. Restart the board in
BOOTSEL mode, and drag the file to the `RPI-RP2` drive. The flasher can restart
the board in BOOTSEL mode over USB. If the drive does not appear:

- XIAO RP2040: hold BOOT, press and release RESET, then release BOOT.
- Nano RP2040 Connect: with USB connected, connect REC to GND and press RESET.
  Remove the jumper when the `RPI-RP2` drive appears.

An RP2040 board has no safe-boot window. Press Ctrl-C to stop a `boot` word
that does not end.

RP2040 boards do not have the `uart.*`, `trace.*`, `pulse.*`, `sleep.*` and
`watchdog.*` words, or `console.uart`, `console.default` and `console.info`.
The Nano RP2040 Connect has the Wi-Fi, HTTP and TCP words. Its Bluetooth words
scan and advertise, but they do not connect. The XIAO RP2040 has no radio
words. RP2040 boards also have smaller tables. See [Limits](/limits/).

## Boards That Do Not Work

Frothy has no firmware for the Arduino UNO, UNO R4, Nano, Nano Every, Nano 33
IoT or Nano R4. Their chips are not ESP32 or RP2040 chips. The Arduino Nano
ESP32 has an ESP32-S3 chip, but it has no official Frothy firmware yet.
