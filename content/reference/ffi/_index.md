---
title: "FFI"
weight: 5
description: "The Froth/C boundary, from runtime registration to project-local bindings."
---

Froth's FFI is intentionally narrow. It exists to expose hardware and native
services without turning the language into raw C.

Use these pages in order:

- [How FFI Works](/reference/ffi/how-it-works/) for the runtime model and the
  C authoring surface
- [Project FFI](/reference/ffi/project-ffi/) for the manifest-driven build path
- [Board FFI Example](/reference/ffi/board-ffi-example/) for an end-to-end
  maintained-board example
- [Project FFI Example](/reference/ffi/project-ffi-example/) for a complete
  project-local binding example

The public project FFI C surface uses `froth_*` and `FROTH_*` names. Internal
runtime files may still use implementation names that are not part of the user
contract.
