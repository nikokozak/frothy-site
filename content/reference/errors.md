---
title: "Error and Notice Codes"
description: "Every stable Frothy status code and the usual recovery."
weight: 3
url: /errors/
aliases:
  - /reference/errors/
icon: triangle-alert
diagnosticCatalog: true
referenceCatalog: true
---

## Status Codes

<a id="code-0"></a>
**`0 — ok`** *(success)*

The operation completed. Code 0 appears as an `ok` completion rather than an error headline.

---

<a id="code-1"></a>
**`1 — out of range`** *(runtime)*

A number or index crossed an ordered bound. Use the reported value and any bound detail to choose an in-range value.

---

<a id="code-2"></a>
**`2 — wrong type`** *(runtime)*

A value has the wrong kind for this operation. Pass the kind named by the detail line.

---

<a id="code-3"></a>
**`3 — bad value`** *(runtime)*

The kind is acceptable, but that particular value is invalid in this domain. Argument details identify the rejected position.

---

<a id="code-4"></a>
**`4 — capacity exceeded`** *(runtime)*

A fixed table, buffer, image, or other bounded store is full. Release or clear entries, or reduce what is being stored.

---

<a id="code-5"></a>
**`5 — overflow`** *(runtime)*

A result or stack would exceed its representable capacity. Reduce the input or the amount of nested work.

---

<a id="code-6"></a>
**`6 — underflow`** *(runtime)*

An operation needed a value that was not available, commonly on a stack. Supply the expected values or fix the calling shape.

---

<a id="code-7"></a>
**`7 — not found`** *(runtime)*

A requested name, field, or item does not exist. Check the reported name or define it first.

---

<a id="code-8"></a>
**`8 — bad source`** *(language)*

Source could not be read, parsed, or compiled. Fix the token identified by the message and caret.

---

<a id="code-9"></a>
**`9 — unsupported`** *(device)*

The operation or value is not supported by the active firmware or profile. Use a supported operation or a build that provides it.

---

<a id="code-10"></a>
**`10 — interrupted`** *(runtime)*

Evaluation was deliberately interrupted and is not catchable. At the prompt this is `interrupted` followed by `ok`; while restored `boot` code is running it is `error: interrupted (10)`.

---

<a id="code-11"></a>
**`11 — corrupt data`** *(device)*

Persisted or incoming data failed validation. Restore, wipe, rebuild, or reacquire it instead of using a partial result.

---

<a id="code-12"></a>
**`12 — i/o failed`** *(device)*

A peripheral or storage operation failed. Check power, wiring, media, and device state, then retry when safe.

---

<a id="code-13"></a>
**`13 — not saved`** *(persistence)*

Volatile state cannot be made durable. A rejected store is an error. An unpersistable overlay is only a nonfatal notice when the entire prompt form is bare `save` or `save:`; rebind the named slot and retry.

---

<a id="code-14"></a>
**`14 — bad handle`** *(resource)*

A handle is closed, stale, or belongs to the wrong driver. Reopen the resource and pass a live handle of the expected kind.

---

<a id="code-15"></a>
**`15 — no network`** *(network)*

The network interface is disconnected. Reconnect it before retrying the operation.

---

<a id="code-16"></a>
**`16 — timed out`** *(network)*

A network operation did not complete in time. Check reachability and retry according to the application.

---

<a id="code-17"></a>
**`17 — dns failed`** *(network)*

A hostname could not be resolved. Check the hostname, DNS service, and network connection.

---

<a id="code-18"></a>
**`18 — refused`** *(network)*

The remote endpoint rejected the connection. Check the address, port, and server state.

---

<a id="code-19"></a>
**`19 — too large`** *(network)*

A network payload or response exceeds the supported bound. Reduce or split it.

---

<a id="code-20"></a>
**`20 — bad protocol`** *(network)*

A peer returned malformed or unexpected protocol data. Check that the endpoint and protocol agree.

---

<a id="code-21"></a>
**`21 — ble not ready`** *(bluetooth)*

The required Bluetooth state has not been established. Enable or configure the prerequisite state first.

---

<a id="code-22"></a>
**`22 — ble busy`** *(bluetooth)*

Another Bluetooth procedure is active or stopping. Wait for it to finish, or stop it before retrying.

---

<a id="code-23"></a>
**`23 — ble timed out`** *(bluetooth)*

A Bluetooth operation did not finish in time. Check range and peer state, then reconnect or retry.

---

<a id="code-24"></a>
**`24 — ble disconnected`** *(bluetooth)*

The Bluetooth peer disconnected. Reconnect before using peer-owned state.

---

<a id="code-25"></a>
**`25 — busy`** *(resource)*

A valid exclusive resource is already claimed. Reuse or close its existing handle, or select a different resource.
