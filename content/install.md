---
title: "Install"
aliases:
  - /guide/00-installation/
description: "Install Froth with Homebrew, direct release archives, or the VS Code extension."
---

Froth currently ships as public prerelease tooling. The maintained CLI command
is:

```text
froth
```

The source code and project history live in the
[Froth source repository](https://github.com/nikokozak/froth); release files are
published from the same repo.

## Homebrew

On macOS, use the Froth Homebrew tap:

```sh
brew tap nikokozak/froth
brew install nikokozak/froth/froth
froth --version
froth doctor
```

## Direct Tarball

The current CLI release is `v0.1.2`. Download the archive for your platform:

```text
froth-v0.1.2-darwin-arm64.tar.gz
froth-v0.1.2-darwin-amd64.tar.gz
froth-v0.1.2-linux-amd64.tar.gz
```

Use `darwin-arm64` for Apple Silicon macOS, `darwin-amd64` for Intel macOS,
or `linux-amd64` for x86_64 Linux:

```sh
VERSION=0.1.2
PLATFORM=darwin-arm64
curl -LO https://github.com/nikokozak/froth/releases/download/v${VERSION}/froth-v${VERSION}-${PLATFORM}.tar.gz
tar -xzf froth-v${VERSION}-${PLATFORM}.tar.gz
mkdir -p ~/.local/bin
install -m 0755 froth ~/.local/bin/froth
froth --version
froth doctor
```

Use a directory already on `PATH`; on macOS, `/usr/local/bin` or
`/opt/homebrew/bin` may be more appropriate than `~/.local/bin`.

## VS Code

Install the public VS Code extension as `NikolaiKozak.froth` from the
Marketplace.

The `v0.1.2` Froth release also carries a fallback VSIX:

```text
froth-vscode-v0.1.1.vsix
```

Install it from a shell where the VS Code `code` command is available:

```sh
curl -LO https://github.com/nikokozak/froth/releases/download/v0.1.2/froth-vscode-v0.1.1.vsix
code --install-extension froth-vscode-v0.1.1.vsix
```

If VS Code cannot find the command on `PATH`, set `froth.cliPath` to the
absolute path of the installed `froth` binary.

## First Check

After installing the CLI, run:

```sh
froth doctor
```

If you have a preflashed Froth board plugged in, connect to it:

```sh
froth connect
```

If more than one serial device is visible, pass the port explicitly:

```sh
froth --port /dev/tty.usbserial-XXXX connect
```

## Flash An ESP32

Most workshop boards are preflashed. You only need this section when you are
installing or recovering firmware yourself.

Install the ESP-IDF toolchain through the Froth CLI:

```sh
froth setup esp-idf
froth doctor
```

Then create an ESP32 project. Use `esp32-devkit-v1` for a plain DevKit-style
board, or `esp32-devkit-v4-game-board` for the Froth Machine:

```sh
froth new blink --target esp-idf --board esp32-devkit-v1
cd blink
froth doctor
froth --port /dev/tty.usbserial-XXXX flash
```

After flashing, use the live path for ordinary changes:

```sh
froth --port /dev/tty.usbserial-XXXX connect
froth --port /dev/tty.usbserial-XXXX send src/main.froth
```

For release files and checksums, use the
[Froth v0.1.2 release](https://github.com/nikokozak/froth/releases/tag/v0.1.2).
