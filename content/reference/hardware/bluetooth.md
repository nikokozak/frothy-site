---
title: "Bluetooth Low Energy"
weight: 11
description: "Scan, advertise, connect, and exchange short GATT values on BLE-enabled ESP32 firmware."
advanced: true
tags: [bluetooth, ble, esp32, gatt]
---

Frothy can sit on either side of a small Bluetooth Low Energy conversation. It
can find a nearby sensor and use one of its characteristics, or expose a small
service that a phone or computer can use.

The interface keeps the useful parts of BLE visible: scan reports, peer
addresses, connection handles, UUIDs, ATT handles, queue pressure, and raw
errors are all inspectable. The common path is still short.

## Availability

This page applies to BLE-enabled `esp32_plain` firmware. The current hardware
proof target is the classic `esp32_devkit_v1` with its original ESP32 chip. The
XIAO ESP32-S3 and other targets have not been hardware-validated for this BLE
tranche.

This is Bluetooth Low Energy only. It does not provide Bluetooth Classic.

The current profile supports all four BLE roles, with one live connection in
total:

- observer: scan for advertisements
- broadcaster: advertise
- central: connect to another peripheral
- peripheral: accept a connection to Frothy's local GATT server

If your firmware does not include `ble.on`, it was built without this profile
feature.

## Start With The Radio

```frothy
ble.on:
ble.info:
```

`ble.on` initializes the compiled BLE roles and waits for the radio to become
ready. `ble.info` prints the radio state, enabled roles, scan and advertising
state, connection count, queue pressure, and the last platform or protocol
reason.

```frothy
ble.off:
```

`ble.off` closes links, invalidates BLE connection handles, clears scan,
advertising, subscription, queue, and remote-client state, and releases the
active stack memory. An installed local GATT table can be reused by a later
`ble.on` until the project is cleared or restored.

## Find And Connect To A Peripheral

Start an active scan:

```frothy
ble.scan.start: 100, 50, 1, 0, -90
```

The arguments are `(interval_ms, window_ms, active, repeats, minimum_rssi)`.
Here Frothy scans for 50 ms in every 100 ms, requests scan responses, filters
duplicate reports, and ignores signals below -90 dBm. Use `1` for `repeats`
when every repeated advertisement matters.

Move through the bounded report queue until a report is available:

```frothy
ble.scan.next?:
ble.scan.rssi:
ble.scan.flags:
ble.scan.data:
```

The current profile keeps eight reports with up to 31 advertisement bytes
each. `ble.info` shows reports received, accepted, filtered, dequeued, or
dropped.

`ble.scan.peer` and `ble.scan.data` return transient Bytes. Pack the selected
peer before stopping the scan, because stopping clears the current report:

```frothy
peer is text.pack: (ble.scan.peer:)
ble.scan.stop:
link is ble.connect: (bytes.from-text: peer), 5000
ble.connection.info: link
```

The packed `peer` contains seven bytes: one address-type byte followed by the
six canonical address bytes. Pass it back through `bytes.from-text` when
connecting.

`link` is a Handle owned by the runtime. Use it for connection and GATT words:

```frothy
ble.connection.ready?: link
ble.connection.rssi: link
ble.connection.mtu: link, 128, 5000
```

Connection tuning is available when a device needs it:

```frothy
ble.connection.params: link, 15, 30, 0, 4000
```

Those arguments are `(connection, minimum_interval_ms, maximum_interval_ms,
latency, supervision_timeout_ms)`. Leave them alone unless the peripheral or
power budget gives you a reason to change them.

## Use A Remote GATT Characteristic

Find a characteristic by its service and characteristic UUIDs:

```frothy
battery is ble.gatt.find: link, "180F", "2A19", 5000
```

Frothy accepts four-hex-digit 16-bit UUIDs and canonical hyphenated 128-bit
UUIDs. `ble.gatt.find` returns the remote characteristic's ATT handle. That
integer belongs to this connection; find it again after reconnecting instead
of saving and reusing it.

Read and write short values:

```frothy
ble.gatt.read: link, battery, 5000
ble.gatt.write: link, battery, (bytes.from-byte: 42), 1, 5000
```

Reads return Bytes. The fourth write argument is `1` for a write with response
or `0` for a write without response. Client values are currently limited to 20
bytes.

Subscribe to notifications:

```frothy
ble.gatt.subscribe: link, battery, $ble.gatt.notifications, 5000
```

Poll the notification queue from ordinary Frothy code:

```frothy
when ble.gatt.next-notification: [
  ble.gatt.notification-attribute:
  ble.gatt.notification-data:
]
```

`ble.gatt.next-notification` returns the owning connection Handle, or `nil`
when the queue is empty. The attribute and data words read the notification it
just selected. Use `$ble.gatt.indications` instead when the remote
characteristic supports indications.

```frothy
ble.gatt.unsubscribe: link, battery, 5000
```

The client keeps four discovered characteristics and four queued notifications.
When the notification queue is full, the oldest entries stay available and a
new arrival is dropped. `ble.gatt.info` shows the cache, subscriptions, queue
high-water mark, dropped or stale arrivals, active procedure, and raw ATT and
platform errors.

Only one foreground GATT procedure runs at a time. Discovery, reads, writes
with response, subscriptions, and unsubscriptions wait interruptibly for their
bounded timeout. This keeps serial use predictable and avoids a second hidden
BLE scheduler.

## Expose A Small GATT Server

A local GATT table is ordinary Frothy data. Each row has one visible shape:

```frothy
record GattRow [ kind, uuid, flags, size ]

service is GattRow: $ble.gatt.service, "FFF0", $ble.gatt.primary, 0

value_flags is 0
set value_flags to $ble.gatt.read + $ble.gatt.write + $ble.gatt.notify
value is GattRow: $ble.gatt.characteristic, "FFF1", value_flags, 20

gatt_rows is cells(2)
set gatt_rows[0] to service
set gatt_rows[1] to value
```

Characteristic rows belong to the service row immediately before them. Their
source row number is also the attribute ID used by Frothy's server words. In
this example the characteristic is attribute `1`.

Install the complete table while the radio is off, seed its value, then start
advertising:

```frothy
ble.gatt.install: gatt_rows
ble.gatt.set: 1, "ready"
ble.on:
ble.advertise.start: "\x02\x01\x06", "\x07\x09Frothy", 100, 1
```

Advertising and scan-response arguments are raw BLE AD payloads, each limited
to 31 bytes. The final argument is `1` for connectable advertising and `0` for
non-connectable advertising.

```frothy
ble.advertise.stop:
```

Server rows use `$ble.gatt.service` or `$ble.gatt.characteristic` for `kind`.
Services use `$ble.gatt.primary` or `$ble.gatt.secondary`. Add the supported
characteristic properties as needed: `$ble.gatt.read`, `$ble.gatt.write`,
`$ble.gatt.write-command`, `$ble.gatt.notify`, and `$ble.gatt.indicate`.

When a phone or computer connects, accept the pending link:

```frothy
link is ble.accept:
```

`ble.accept` returns a Handle, or `nil` when no connection is waiting. Remote
writes enter a four-entry queue:

```frothy
when ble.gatt.next-write: [
  ble.gatt.write-attribute:
  ble.gatt.write-data:
]
```

Read or replace the local value directly:

```frothy
ble.gatt.get: 1
ble.gatt.set: 1, "awake"
```

Send an update after the remote side subscribes:

```frothy
ble.gatt.notify: link, 1, "awake"
ble.gatt.indicate: link, 1, "awake", 5000
```

Notifications return after enqueueing. Indications wait for the peer's
acknowledgement or the timeout. `ble.gatt.info` reports table capacity, value
bytes, subscriptions, write-queue pressure, and indication state.

The current server budget is two services, six characteristics, 256 value
bytes in total, four queued remote writes of up to 64 bytes, and two subscribed
CCCD entries.

## Close And Save Cleanly

Connection Handles and the radio are volatile. Close a link and remove the
Handle from persistent project state before saving:

```frothy
ble.connection.close: link
set link to false
save
```

Saving shuts down the BLE radio and drops live connections, subscriptions,
queues, and discovered remote handles. Restoring or clearing the project also
clears the installed platform GATT table. Put GATT installation and radio
startup in `boot` when the device should resume BLE behavior after restore.

## Current Limits

The restrained surface is deliberate:

- one connection total
- one GATT procedure at a time
- short client values up to 20 bytes
- no long or prepared GATT values
- no arbitrary descriptor API
- no pairing, bonding, encryption, or authenticated characteristics
- no Bluetooth Classic
- no user-visible multicore or parallel-procedure machinery

These limits cover the common Arduino-style BLE peripheral and central paths
without hiding BLE's useful diagnostics or committing Frothy to a large
framework.

## What BLE Costs On The ESP32

The current `esp32_devkit_v1` development build measured:

| Measurement | Used or free | Total or comparison |
| --- | ---: | ---: |
| Warm free heap, radio off | 112,188 bytes free | — |
| Free heap, BLE active | 78,480 bytes free | 33,708-byte active cost |
| Static DRAM linker region | 90,340 bytes used | 124,580 bytes total; 34,240 remain |
| IRAM linker region | 126,939 bytes used | 131,072 bytes total; 4,133 remain |
| Application partition | 238,576 bytes free | after the BLE client build |

The practical reading is that BLE does not consume the whole board or make
ordinary Frothy projects unusable. About 78 KB of general heap remained with
BLE active in the measured build, and the profile's normal program and object
budgets still fit. The narrow IRAM margin matters more when adding future
native firmware features.

Free heap and static linker margin are not two piles to add together. They are
different views of memory at runtime and link time. These measurements are a
build snapshot, not a permanent ABI promise.

## Diagnose Before Guessing

Use the built-in reports first:

```frothy
ble.info:
ble.gatt.info:
ble.connection.info: link
```

They expose requested and actual timings, queue pressure, connection state,
ATT errors, stack return codes, and disconnect reasons. That is the escape
hatch when the friendly path is not enough.
