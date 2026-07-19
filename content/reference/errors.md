---
title: "Error and Notice Codes"
description: "The stable Frothy error codes, what error and notice responses mean, and how to recover."
weight: 3
url: /errors/
aliases:
  - /reference/errors/
icon: triangle-alert
---

Frothy reports failures with a short human label, a numeric code, and—when it
has one—the actual value that was rejected. The device stays at a usable
prompt after a recoverable error.

## Response Shapes

An error stops the current form:

```text
error: wrong type: "string" (2)
expected an int, got text
```

The first line is the stable, self-contained headline:

```text
error: label[: actual-value] (code)
```

Lines after it may identify an argument, describe an expected kind or bound,
or show source context and a caret. Host tools should preserve those lines for
the person debugging the program. They should classify the response from its
status and numeric code rather than trying to interpret the English details.

A notice reports a requested side effect that did not happen, but does not
fail the form:

```text
notice: not saved (13)
detail: cannot save slot 'appuart' - bound to a live handle or buffer
ok
```

The final `ok` means evaluation completed and more forms may be sent. It does
**not** mean the requested save became durable. A notice is therefore warning
state, not error state: show it, keep its details, and continue programming the
device.

At the interactive prompt, a deliberate interrupt is a separate
successful-status completion:

```text
interrupted
ok
```

In that phase it does not use an `error:` headline. Host tools should preserve
and surface the `interrupted` line, leave error state clear, and allow the next
form.

An interrupt that stops restored `boot` code after the safe-boot window is a
startup failure instead:

```text
error: interrupted (10)
```

Pressing Ctrl-C during the safe-boot window reports `safe boot` and skips the
restored startup path. In every phase, an interrupt is control flow rather than
a catchable runtime failure: `attempt`/`rescue` cannot catch code 10.

## Rejected Values

The value between the label and numeric code is the value the operation
rejected. This applies generically to language operators and native words.

```text
> "string" + 5
error: wrong type: "string" (2)
expected an int, got text
>
```

```text
> gpio.mode: $led_builtin, 3
error: bad value: 3 (3)
detail: gpio.mode argument 2 was rejected
>
```

The representation is safe for the serial transcript. Text is quoted and
escapes newlines and other control characters; when it cannot fit, it becomes
a `text length` summary. Bytes, cells, records, record shapes, and handles are
always summarized by kind plus size or name. Secret arguments appear as
`<redacted>`. Details can add the expected type, argument position, or valid
bound without making host tools parse that prose.

## Code Table

The numeric code is the recovery category. The label is its canonical short
name; details make an individual occurrence more specific.

| Code | Label | Meaning and usual recovery |
| ---: | --- | --- |
| <span id="code-0"></span>`0` | `ok` | The operation completed. Code 0 is represented by an `ok` completion rather than an error headline. |
| <span id="code-1"></span>`1` | `out of range` | A number or index crossed an ordered bound. Use the reported value and any bound detail to choose an in-range value. |
| <span id="code-2"></span>`2` | `wrong type` | A value has the wrong kind for this operation. Pass the kind named by the detail line. |
| <span id="code-3"></span>`3` | `bad value` | The kind is acceptable, but that particular value is invalid in this domain. Use an allowed value; argument details identify the rejected position. |
| <span id="code-4"></span>`4` | `capacity exceeded` | A fixed table, buffer, image, or other bounded store is full. Release or clear entries, or reduce what is being stored. |
| <span id="code-5"></span>`5` | `overflow` | A result or stack would exceed its representable capacity. Reduce the input or the amount of nested work. |
| <span id="code-6"></span>`6` | `underflow` | An operation needed a value that was not available, commonly on a stack. Supply the expected values or fix the calling shape. |
| <span id="code-7"></span>`7` | `not found` | A requested name, field, or item does not exist. Check the reported name or define it first. |
| <span id="code-8"></span>`8` | `bad source` | Source could not be read, parsed, or compiled. Fix the token identified by the message and caret. |
| <span id="code-9"></span>`9` | `unsupported` | This operation or value is not supported by the active firmware/profile. Use a supported operation or a build that provides the capability. |
| <span id="code-10"></span>`10` | `interrupted` | Evaluation was deliberately interrupted and is not catchable. At the prompt it is `interrupted` followed by `ok`; while restored `boot` is running it is `error: interrupted (10)`. Correct runaway work or continue when the stop was intentional. |
| <span id="code-11"></span>`11` | `corrupt data` | Persisted or incoming data failed validation. Restore, wipe, rebuild, or reacquire the data instead of using a partial result. |
| <span id="code-12"></span>`12` | `i/o failed` | A peripheral or storage operation failed. Check power, wiring, media, and device state, then retry when safe. |
| <span id="code-13"></span>`13` | `not saved` | Volatile state cannot be stored or made durable. A rejected store is an error: keep the value transient or convert it to a persistable form. An unpersistable overlay is a notice only when the entire prompt form is bare `save` or `save:`; rebind the named slot and retry. |
| <span id="code-14"></span>`14` | `bad handle` | A handle is closed, stale, or belongs to the wrong driver. Reopen the resource and pass a live handle of the expected kind. |
| <span id="code-15"></span>`15` | `no network` | The network interface is disconnected. Reconnect it before retrying the operation. |
| <span id="code-16"></span>`16` | `timed out` | A network operation did not complete in time. Check reachability and retry according to the application. |
| <span id="code-17"></span>`17` | `dns failed` | A hostname could not be resolved. Check the hostname, DNS service, and network connection. |
| <span id="code-18"></span>`18` | `refused` | The remote endpoint rejected the connection. Check the address, port, and server state. |
| <span id="code-19"></span>`19` | `too large` | A network payload or response exceeds the supported bound. Reduce or split it. |
| <span id="code-20"></span>`20` | `bad protocol` | A peer returned malformed or unexpected protocol data. Check that the endpoint and protocol agree. |
| <span id="code-21"></span>`21` | `ble not ready` | The required Bluetooth state has not been established. Enable or configure the prerequisite state first. |
| <span id="code-22"></span>`22` | `ble busy` | Another Bluetooth procedure is active or stopping. Wait for it to finish, or stop it before retrying. |
| <span id="code-23"></span>`23` | `ble timed out` | A Bluetooth operation did not finish in time. Check range and peer state, then reconnect or retry. |
| <span id="code-24"></span>`24` | `ble disconnected` | The Bluetooth peer disconnected. Reconnect before using peer-owned state. |
| <span id="code-25"></span>`25` | `busy` | A valid exclusive resource is already claimed. Reuse or close its existing handle, or select a different resource. |

## Important Cases

### Range, Type, and Domain

Codes 1, 2, and 3 answer different questions:

- `out of range (1)` means the value crossed an ordered limit, such as a cell
  index past the end
- `wrong type (2)` means the operation received the wrong kind of value
- `bad value (3)` means the kind was right but the value is not allowed, such
  as zero as a divisor

For example, a cell access can report both the rejected index and its bound:

```text
error: out of range: 9 (1)
cell index 9 is past the end (length 1)
```

### Save Notice Versus Save Error

When the entire prompt form is bare `save` or `save:`, a save rejected because
of volatile overlay state is a nonfatal notice:

```text
> save
notice: not saved (13)
detail: cannot save slot 'appuart' - bound to a live handle or buffer
ok
>
```

The live overlay is still available and the previous saved image is unchanged.
Close the resource, replace the top-level handle or buffer binding with a
persistable value such as `nil`, and run `save` again.

When `save:` is part of a larger form, code 13 remains an error so the caller
or `attempt`/`rescue` can react:

```text
error: not saved (13)
detail: cannot save slot 'appuart' - bound to a live handle or buffer
```

### Exclusive Resources

Opening an already-owned UART reports code 25 and includes the rejected port:

```text
error: busy: 0 (25)
detail: uart.open argument 1 was rejected
```

Reuse the handle that already owns the port, close it before reopening, or use
a different supported port. See the [UART reference](/reference/modules/uart/)
for the complete lifecycle.
