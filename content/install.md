---
title: "Install"
aliases:
  - /guide/00-installation/
description: "Flash Frothy from the browser, check the board, and start writing."
---

You do not need to clone Frothy or install a compiler to get started. The
browser flasher installs ready-made firmware, and the browser editor talks to
the board directly over USB.

## What You Need

- a supported ESP32 board and a USB data cable
- desktop Chrome, Edge, or Opera
- macOS, Linux, or Windows

## 1. Flash The Board

Open the [Frothy browser flasher](/flash/), choose your board, and select
**Flash Frothy**. Keep the page open until the progress bar reaches the end and
the board resets.

The flasher uses Web Serial. Your browser will ask which serial device it may
use; choose the ESP32 you plugged in.

## 2. Check Frothy

Choose **Check Frothy** on the flasher page. This sends a small status request
and confirms that the board is reachable and running Frothy.

If the check cannot reach the board, close other applications using its serial
port, press the board's **EN** button (or unplug and reconnect it), and try
again.

## 3. Start Writing

Continue to the [browser editor](/editor/), choose **Connect**, and select the
same board. Put the cursor in a complete form and choose **Run Form**, or select
one complete form and run that selection. **Run File** sends the complete
sketch in order.

Edits save locally in the browser. Use **Download .fr** when you want a normal
file copy.

## VS Code And The CLI

Install the **Frothy** extension from the VS Code Marketplace (publisher:
**NikolaiKozak**) when you want a local project workflow. The extension uses
the installed `frothy` CLI for serial sessions; the browser tools do not.

Homebrew is the intended packaged CLI path. The formula is prepared in the
Frothy source tree, but the new tap is not published yet, so there is no honest
Homebrew command to run today. Until the first packaged release, follow the
[developer setup](/reference/toolchain/development/) to build the CLI from
source.

## What To Read Next

- [Getting Started](/guide/02-getting-started/) walks through your first prompt.
- [Blink an LED](/tutorials/blink-an-led/) gives you the smallest hardware proof.
- [CLI](/reference/toolchain/cli/) lists the local command surface.
