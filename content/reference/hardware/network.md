---
title: "Wi-Fi, HTTP & TCP"
weight: 10
url: /reference/modules/wifi/
description: "Store Wi-Fi credentials, connect, fetch bounded HTTP bodies, and use two live TCP sockets."
icon: wifi
tags: [wifi, http, tcp, network]
---

The network surface has three layers: establish Wi-Fi from stored credentials,
use `http.get` for a complete small response, or open a TCP `Handle` when the
application needs a stream.

## Connect And Fetch

Run `wifi.save` once when credentials change, then connect and copy the
transient response into Text:

```frothy
wifi.save: "network-name", "network-password"
wifi.connect:

body is text.pack: (http.get: "http://example.com/")
print: body
```

Credentials are stored in the target's dedicated `frothy_wifi` NVS namespace,
separate from the saved Frothy project overlay. `wifi.connect` waits up to the
platform connection budget and remains interruptible with Ctrl-C.

## Word Table

| Word | Result | Use |
| --- | --- | --- |
| [`wifi.save`](/reference/words/#wifi-save) | `nil` | Store SSID and password |
| [`wifi.connect`](/reference/words/#wifi-connect) | `nil` | Connect with stored credentials |
| [`wifi.ready?`](/reference/words/#wifi-ready) | `Bool` | Test current address-ready state |
| [`http.get`](/reference/words/#http-get) | `Bytes` | Fetch one successful response body |
| [`tcp.open`](/reference/words/#tcp-open) | `Handle` | Open a host and port |
| [`tcp.available`](/reference/words/#tcp-available) | `Int` | Count immediately readable bytes |
| [`tcp.read`](/reference/words/#tcp-read) | `Bytes` | Read up to a requested count |
| [`tcp.write`](/reference/words/#tcp-write) | `nil` | Send Text or Bytes |
| [`tcp.close`](/reference/words/#tcp-close) | `nil` | Close and release a socket handle |

## Wi-Fi State And Events

```frothy
to watch-wifi-down [
  on wifi.disconnected [ print: "offline\n" ]
]

to watch-wifi-up [
  on wifi.reconnected [ print: "online\n" ]
]

watch-wifi-down:
watch-wifi-up:
wifi.connect:
wifi.ready?:
```

The ESP32 station automatically retries after a real disconnect. The lifecycle
events describe loss and recovery after an initial successful connection;
initial connection does not emit `wifi.reconnected`. Any TCP handle open across
a disconnect becomes failed and must be closed and reopened.

SSIDs may contain 1–32 bytes and passwords up to 64 bytes on the current ESP32
target. An empty password is valid for an open network.

## Bounded HTTP GET

`http.get` succeeds only while Wi-Fi is ready, requires a 2xx response, and
returns the complete body as transient Bytes. The current response-body cap is
4096 bytes; a larger body fails rather than returning a silent prefix.

```frothy
to body-length with url [
  here body is http.get: url
  bytes.length: body
]

body-length: "http://example.com/"
```

Pack the result when it must leave the current evaluation. Transport, DNS, TLS,
timeout, redirect, non-2xx, and oversize failures are surfaced as network
errors; `attempt ... rescue ...` can provide an application fallback.

## TCP Stream

```frothy
socket is tcp.open: "example.com", 80
tcp.write: socket, "GET / HTTP/1.0\r\nHost: example.com\r\n\r\n"

when (tcp.available: socket) > 0 [
  print: (tcp.read: socket, 256)
]

tcp.close: socket
set socket to nil
```

`tcp.read` requests a positive count up to 4096 and may return fewer bytes. Its
Bytes result can be printed or processed immediately. A zero ready count means
an immediate read would have no data; it is not itself an end-of-stream signal.

The ESP32 plain profile supports two simultaneous TCP handles. Ports must be in
`1..65535`. `tcp.write` sends every byte of its Text or Bytes input or reports
an error.

## Persistence Pattern

TCP handles are volatile. Close them and replace top-level handle values before
`save`; reconnect from `boot` when appropriate. Credentials do not need to be
saved in the overlay:

```frothy
socket is false

boot is fn [
  wifi.connect:
  set socket to tcp.open: "example.com", 80
]
```

See [Events](/reference/modules/events/) for handler identity and [Text, Bytes
& PAD](/reference/modules/text-bytes-pad/) for response lifetimes.
