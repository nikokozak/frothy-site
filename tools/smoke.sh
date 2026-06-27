#!/usr/bin/env bash
set -euo pipefail

export LC_ALL=C
export LANG=C

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

rm -rf public

hugo --gc --minify

INDEX_FILE="public/index.json"

for needle in \
  'save' \
  'dangerous.wipe' \
  'gpio.write' \
  'tm1629' \
  'i2c.init' \
  'uart.init' \
  'ledc.timer-config' \
  'matrix' \
  'game.run' \
  'dial.solve' \
  'scan.solve' \
  'froth doctor' \
  'froth_project_bindings'
do
  grep -q "$needle" "$INDEX_FILE"
done

for route in \
  public/index.html \
  public/install/index.html \
  public/guide/index.html \
  public/guide/00-installation/index.html \
  public/guide/01-what-is-froth/index.html \
  public/guide/02-getting-started/index.html \
  public/guide/03-the-stack/index.html \
  public/guide/04-words-and-definitions/index.html \
  public/guide/05-perm-and-named/index.html \
  public/guide/06-quotations-and-control/index.html \
  public/guide/07-error-handling/index.html \
  public/guide/08-strings-and-io/index.html \
  public/guide/09-talking-to-hardware/index.html \
  public/guide/10-snapshots-and-persistence/index.html \
  public/guide/11-where-to-go-next/index.html \
  public/guide/12-ffi-and-c/index.html \
  public/tutorials/index.html \
  public/tutorials/blink-an-led/index.html \
  public/tutorials/interactive-workflow/index.html \
  public/tutorials/read-inputs/index.html \
  public/tutorials/read-a-button/index.html \
  public/tutorials/read-a-sensor/index.html \
  public/tutorials/build-a-calculator/index.html \
  public/tutorials/build-a-small-game/index.html \
  public/tutorials/fade-an-led/index.html \
  public/tutorials/drive-a-servo/index.html \
  public/tutorials/advent-of-code-safe-dial/index.html \
  public/tutorials/advent-of-code-grid-scan/index.html \
  public/reference/index.html \
  public/reference/words/index.html \
  public/reference/interactive-profile/index.html \
  public/reference/profiles/index.html \
  public/reference/image-and-persistence/index.html \
  public/reference/snapshot-format/index.html \
  public/reference/cli/index.html \
  public/reference/editor/index.html \
  public/reference/vscode/index.html \
  public/reference/project-and-build/index.html \
  public/reference/build-options/index.html \
  public/reference/ffi/index.html \
  public/reference/ffi/how-it-works/index.html \
  public/reference/ffi/project-ffi/index.html \
  public/reference/ffi/project-ffi-example/index.html \
  public/reference/ffi/board-ffi-example/index.html \
  public/reference/hardware/index.html \
  public/reference/hardware/base-image/index.html \
  public/reference/hardware/words/index.html \
  public/reference/hardware/display/index.html \
  public/reference/hardware/input/index.html \
  public/reference/hardware/gpio/index.html \
  public/reference/hardware/i2c/index.html \
  public/reference/hardware/timing/index.html \
  public/reference/hardware/uart/index.html \
  public/reference/hardware/pwm-and-ledc/index.html \
  public/reference/hardware/utilities/index.html \
  public/workshop/index.html \
  public/workshop/broken-beacon/index.html \
  public/workshop/quick-reference/index.html \
  public/what-makes-froth-different/index.html \
  public/oldfroth/index.html
do
  test -f "$route"
done

if rg -n 'Frothy|FROTHY|\bfrothy\b' public \
  --glob '*.html' \
  --glob '*.json' \
  --glob '!public/guide/00-installation/index.html' \
  --glob '!public/guide/02-values-names-and-rebinding/index.html' \
  --glob '!public/guide/03-code-locals-and-blocks/index.html' \
  --glob '!public/guide/04-control-flow-cells-and-records/index.html' \
  --glob '!public/guide/05-inspection-and-live-workflow/index.html' \
  --glob '!public/guide/06-persistence-boot-and-recovery/index.html' \
  --glob '!public/guide/07-projects-build-and-flash/index.html' \
  --glob '!public/guide/08-hardware-and-the-protoboard/index.html' \
  --glob '!public/guide/09-extending-with-ffi/index.html' \
  --glob '!public/guide/10-where-to-go-next/index.html' \
  --glob '!public/reference/build-options/index.html' \
  --glob '!public/reference/profiles/index.html' \
  --glob '!public/reference/snapshot-format/index.html' \
  --glob '!public/reference/vscode/index.html' \
  --glob '!public/reference/hardware/matrix/index.html' \
  --glob '!public/reference/hardware/tm1629/index.html'
then
  echo "error: stale public Frothy identity found in generated pages" >&2
  exit 1
fi
