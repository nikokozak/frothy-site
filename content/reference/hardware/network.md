---
title: "Wi-Fi, HTTP & TCP"
weight: 10
url: /reference/modules/wifi/
description: "Connect or host Wi-Fi, exchange bounded HTTP bodies, and use TCP clients and listeners."
icon: wifi
tags: [wifi, http, tcp, network]
---

The network surface has four paths: connect with stored credentials, host an
access point, exchange bounded HTTP bodies, or use TCP handles. Net-enabled
profiles provide every word on this page.

## Connect And Request

Run `wifi.save` once when credentials change, then connect and copy the
transient response into Text:

```frothy
wifi.save: "network-name", "network-password"
wifi.connect:

body is text.pack: (http.get: "http://example.com/")
print: body

reply is text.pack: (http.post: "http://example.com/readings", "reading=42")
print: reply
```

Credentials are stored in the target's dedicated `frothy_wifi` NVS namespace,
separate from the saved Frothy project overlay. `wifi.connect` waits up to the
platform connection budget and remains interruptible with Ctrl-C.

## Word Table

| Word | Result | Use |
| --- | --- | --- |
| [`wifi.save`](/reference/words/#wifi-save) | `nil` | Store SSID and password |
| [`wifi.connect`](/reference/words/#wifi-connect) | `nil` | Connect with stored credentials |
| [`wifi.host`](/reference/words/#wifi-host) | `nil` | Start or reconfigure an access point with captive DNS |
| [`wifi.ready?`](/reference/words/#wifi-ready) | `Bool` | Test station or access-point readiness |
| [`wifi.ip`](/reference/words/#wifi-ip) | `Text` | Get the active interface address |
| [`http.get`](/reference/words/#http-get) | `Bytes` | Fetch one successful response body |
| [`http.post`](/reference/words/#http-post) | `Bytes` | Post Text or Bytes and return the response body |
| [`tcp.open`](/reference/words/#tcp-open) | `Handle` | Open a host and port |
| [`tcp.listen`](/reference/words/#tcp-listen) | `Handle` | Open the single listener slot |
| [`tcp.accept`](/reference/words/#tcp-accept) | `Handle|nil` | Accept one waiting client without blocking |
| [`tcp.available`](/reference/words/#tcp-available) | `Int` | Count immediately readable bytes |
| [`tcp.read`](/reference/words/#tcp-read) | `Bytes` | Read up to a requested count |
| [`tcp.write`](/reference/words/#tcp-write) | `nil` | Send Text or Bytes |
| [`tcp.close`](/reference/words/#tcp-close) | `nil` | Close and release a connection or listener handle |

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

`wifi.ready?` returns true for a connected station or a hosted access point.
The ESP32 station automatically retries after a real disconnect. The lifecycle
events describe loss and recovery after an initial successful connection.
Initial connection does not emit `wifi.reconnected`. Hosting adds no lifecycle
event. Any TCP connection open across a disconnect becomes failed and must be
closed and reopened.

SSIDs may contain 1–32 bytes and passwords up to 64 bytes on the current ESP32
target. An empty password is valid for an open network.

## Host A Captive Page

`wifi.host` replaces station mode with an access point and a captive DNS
responder. The responder answers every lookup with the device's own address.
After a phone joins, its operating system can open the portal sheet against a
program that serves port 80. `wifi.ip` returns the address to use in a browser.

An empty hosting password creates an open network. A nonempty password must
contain 8 through 63 bytes for WPA2. A password outside that range returns
`bad value`. Another `wifi.host` call reconfigures the access point. A later
`wifi.connect` stops the access point and returns to station mode.

`tcp.listen` opens the single listener slot. Ports must be in `1..65535`;
other values return `bad value`. Repeating the same port returns the same
handle. A different port returns `busy` until the listener closes.
`tcp.accept` returns immediately with `nil` or an ordinary TCP connection
handle. Poll it inside an `every` loop:

```frothy
wifi.host: "frothy", ""
server is tcp.listen: 80
to serve [ c is tcp.accept: server; if c [ tcp.read: c, 1024; tcp.write: c, "HTTP/1.1 200 OK\r\nConnection: close\r\n\r\n<h1>hello</h1>"; tcp.close: c ] ]
to start-serving [ every 150 [ serve: ] ]
start-serving:
```

The `tcp.read: c, 1024` call reads the complete small request before
`tcp.close`. Closing a connection with unread request bytes can send a TCP
reset. The reset can arrive before the response, which makes the browser show
an empty page.

The prompt has a per-line input budget. Put a long response in more than one
Text value. Write the values back-to-back, such as
`tcp.write: c, p1; tcp.write: c, p2`.

Portal browsers often request a page twice for one interaction. Use `millis`
to debounce each URL that has a side effect. The bundled
`examples/14-captive-portal.fr` example uses this pattern for a button that
toggles the LED. Open it from the browser editor's **Examples** list or with
`Frothy: Open Example` in VS Code.

## Bounded HTTP GET And POST

`http.get` and `http.post` use plain `http://` URLs. Each word requires a 2xx
response and returns the complete body as transient Bytes. `http.post` accepts
Text or Bytes and sends it with `Content-Type: text/plain`.

The current `FR_HTTP_MAX_BODY` response cap is 4096 bytes. Both words use the
same timeout and network-error behavior. An oversized response returns an
error and no partial result.

```frothy
to body-length with url [
  here body is http.get: url
  bytes.length: body
]

body-length: "http://example.com/"
http.post: "http://example.com/readings", "reading=42"
```

Pack the result when it must leave the current evaluation. Transport, DNS,
timeout, non-2xx, protocol, and oversize failures are network errors.
`attempt ... rescue ...` can provide an application fallback.

## TCP Client Stream

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

Ports must be in `1..65535`. `tcp.write` sends every byte of its Text or Bytes
input or reports an error.

## TCP Capacity And Cleanup

`tcp.open` and clients returned by `tcp.accept` share the connection capacity.
ESP32 profiles carry four simultaneous TCP connection handles. The Nano RP2040
Connect carries two. The listener uses a separate single slot. When the
connection handles are full, `tcp.open` or `tcp.accept` returns
`capacity exceeded`.

`tcp.close` accepts a connection or listener handle. `close-handles` also
reaches both kinds.

## Persistence Pattern

TCP connection and listener handles are volatile. Close them and replace
top-level handle values before `save`; reconnect from `boot` when appropriate.
Credentials do not need to be saved in the overlay:

```frothy
socket is false

boot is fn [
  wifi.connect:
  set socket to tcp.open: "example.com", 80
]
```

See [Events](/reference/modules/events/) for handler identity and [Text, Bytes
& PAD](/reference/modules/text-bytes-pad/) for response lifetimes.
