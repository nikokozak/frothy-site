---
title: "Troubleshooting"
weight: 4
description: "Recovery notes for workshop connection, display, loop, and saved-state problems."
---

## Board Won't Connect

Check the cable. Try `froth --port /dev/tty.usbserial-XXXX doctor` if
multiple ports are visible. Swap the cable if in doubt.

## Matrix Stays Dark

Run:

```froth
matrix.init:
grid.fill: true
grid.show:
```

If it is still dark, try:

```froth
matrix.brightness!: 4
```

If it remains dark after that, the board may need swapping.

## Board Is Stuck Or Unresponsive

Press Ctrl-C to interrupt. If that does not work, unplug and replug the USB
cable. Press Ctrl-C during the safe boot prompt, then run:

```froth
dangerous.wipe
```

## Puzzle State Is Broken

Type `restore` if you saved a working state earlier. If you never saved, type
`dangerous.wipe` to reset the puzzle words to their original broken defaults
and start over.

## Creative Project Is Broken

**Mission file not working:** Click the joystick to stop. Run
`dangerous.wipe` to clear state. Re-send the mission file. Type the run
command again.

## VS Code Cannot Find The CLI

Set `froth.cliPath` in VS Code settings to the full path of the `froth`
binary. Or fall back to the terminal:

```sh
froth connect
```
