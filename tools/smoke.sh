#!/usr/bin/env bash
# Smoke test: build the site and assert the key routes, search index, and the
# Frothy identity + interactive bits are present. Run from anywhere.
set -euo pipefail
export LC_ALL=C LANG=C

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

rm -rf public
hugo --gc --minify

fail() { echo "smoke: FAIL — $1" >&2; exit 1; }

# 1. search index contains core Frothy terms
INDEX="public/index.json"
test -f "$INDEX" || fail "missing $INDEX"
for needle in 'save' 'dangerous.wipe' 'gpio' 'adc' 'blink' 'frothy in y minutes' 'attempt' 'rescue' 'record point' 'wifi.disconnected' 'pad.emit-byte' 'trace.open' 'pulse.play' 'console.read-line' 'console.uart' 'ble.gatt.find' '$baud_1200'; do
  grep -Fqi "$needle" "$INDEX" || fail "search index missing term: $needle"
done

# 2. core routes exist (section indexes + a few representative deep pages)
for route in \
  public/index.html \
  public/install/index.html \
  public/editor/index.html \
  public/flash/index.html \
  public/errors/index.html \
  public/guide/index.html \
  public/guide/concepts/index.html \
  public/guide/01-what-is-froth/index.html \
  public/guide/12-ffi-and-c/index.html \
  public/tutorials/index.html \
  public/tutorials/blink-an-led/index.html \
  public/reference/index.html \
  public/reference/ten-minutes/index.html \
  public/reference/language/index.html \
  public/reference/words/index.html \
  public/reference/modules/index.html \
  public/reference/modules/board/index.html \
  public/reference/modules/gpio/index.html \
  public/reference/modules/timing/index.html \
  public/reference/modules/events/index.html \
  public/reference/modules/math-and-random/index.html \
  public/reference/modules/text-bytes-pad/index.html \
  public/reference/modules/i2c/index.html \
  public/reference/modules/uart/index.html \
  public/reference/modules/pwm/index.html \
  public/reference/modules/wifi/index.html \
  public/reference/modules/power/index.html \
  public/reference/modules/signals/index.html \
  public/reference/modules/console/index.html \
  public/reference/modules/bluetooth/index.html \
  public/reference/hardware/index.html \
  public/reference/hardware/gpio/index.html \
  public/reference/device/index.html \
  public/reference/device/interactive-profile/index.html \
  public/reference/device/image-and-persistence/index.html \
  public/reference/toolchain/index.html \
  public/reference/toolchain/cli/index.html \
  public/reference/toolchain/project-and-build/index.html \
  public/reference/toolchain/editor/index.html \
  public/reference/ffi/index.html \
  public/what-makes-frothy-different/index.html \
  public/contact/index.html
do
  test -f "$route" || fail "missing route: $route"
done

# Public host tooling links directly to stable error-code anchors.
ERRORS_PAGE="public/errors/index.html"
for ((code = 0; code <= 25; code++)); do
  grep -Eq "id=[\"']?code-${code}[\"'> ]" "$ERRORS_PAGE" || fail "errors page missing code-${code} anchor"
done
grep -q 'data-reference-catalog' "$ERRORS_PAGE" || fail "errors page missing catalog shell"
grep -q 'data-diagnostic-catalog' "$ERRORS_PAGE" || fail "errors page missing diagnostic hook"
grep -Fq '13 — not saved' "$ERRORS_PAGE" || fail "errors page missing save status"
grep -Fq 'only a nonfatal notice' "$ERRORS_PAGE" || fail "errors page loses notice semantics"

# Contact email must not appear as a harvestable plain-text address in the source.
grep -q 'nkozak@nyu.edu' public/contact/index.html && fail "contact email is plain-text in source" || true

# Machine/Workshop/OldFroth were removed in the content pass — make sure they stay gone.
for gone in public/machine public/workshop public/oldfroth; do
  test ! -e "$gone" || fail "removed section still present: $gone"
done

# 3. homepage carries the new identity + interactive hooks
grep -q 'Frothy' public/index.html        || fail "homepage missing 'Frothy'"
grep -q 'data-repl-editor' public/index.html || fail "homepage missing REPL hero"
grep -q 'docs-side' public/guide/index.html || fail "guide missing sidebar"
grep -q 'prefers-color-scheme' public/index.html && fail "homepage defaults to system dark mode" || true

# 4. old-URL aliases resolve for renamed or moved pages
test -f public/what-makes-froth-different/index.html || fail "missing alias for old how-its-different URL"
test -f public/reference/interactive-profile/index.html || fail "missing alias for old interactive-profile URL"
test -f public/reference/image-and-persistence/index.html || fail "missing alias for old image-and-persistence URL"
test -f public/reference/cli/index.html || fail "missing alias for old CLI URL"
test -f public/reference/editor/index.html || fail "missing alias for old editor URL"
test -f public/reference/errors/index.html || fail "missing alias for error-code reference URL"
test -f public/reference/hardware/bluetooth/index.html || fail "missing alias for old Bluetooth module URL"
grep -q 'data-word-catalog' public/reference/words/index.html || fail "word catalog missing catalog hook"
grep -q 'data-catalog-list' public/reference/words/index.html || fail "word catalog missing page sidebar"
grep -q 'data-catalog-filter' public/reference/words/index.html || fail "word catalog missing search"
grep -Eq 'id="?console-read-line"?' public/reference/words/index.html || fail "word catalog missing console.read-line"
grep -Fq 'Bytes values live only for the current evaluation' public/reference/words/index.html && fail "word catalog repeats section copy inside entries" || true
node --check static/js/reference-layout.js >/dev/null || fail "word catalog script does not parse"
CATALOG_ANCHORS="$(grep -o '<a id=' public/reference/words/index.html | wc -l | tr -d ' ')"
CATALOG_ENTRIES="$(grep -o '<strong><code>' public/reference/words/index.html | wc -l | tr -d ' ')"
test "$CATALOG_ANCHORS" -eq "$CATALOG_ENTRIES" || fail "word catalog anchors and entries differ"
test "$CATALOG_ENTRIES" -ge 200 || fail "word catalog is unexpectedly incomplete"

# 5. Editor and flasher belong only to app.frothy.dev. The site keeps handoff
# pages, but no second implementation or copied firmware tree.
grep -Fq 'https://app.frothy.dev/editor' public/editor/index.html || fail "editor route does not hand off to app"
grep -Fq 'https://app.frothy.dev/flash' public/flash/index.html || fail "flasher route does not hand off to app"
grep -Fq 'https://app.frothy.dev/editor' public/index.html || fail "site nav does not link to app editor"
grep -Fq 'https://app.frothy.dev/flash' public/index.html || fail "site nav does not link to app flasher"
test ! -e static/test/editor || fail "legacy site editor implementation returned"
test ! -e static/test/flash || fail "legacy site flasher implementation returned"
test -z "$(find public/test -type f -print -quit 2>/dev/null)" || fail "legacy tool assets are still published"

# 6. visible documentation IA keeps deep guides out of Reference.
grep -Fq 'href=../reference/words/' public/reference/index.html || fail "reference index missing word catalog"
grep -Fq 'href=../errors/' public/reference/index.html || fail "reference index missing diagnostic catalog"
grep -Fq 'href=../reference/modules/' public/guide/index.html || fail "guide index missing module guides"
grep -Fq 'href=../reference/language/' public/guide/index.html || fail "guide index missing language tour"
grep -q 'data-guide-cards' public/guide/index.html || fail "guide index missing card directory"
grep -q '<ol class=guide-arc' public/guide/index.html && fail "guide index still contains the concepts arc" || true
grep -q '<ol class=guide-arc' public/guide/concepts/index.html || fail "concepts page missing learning arc"
grep -Eq 'data-guide-cards.*reference/language/.*guide/concepts/.*reference/modules/' public/guide/index.html || fail "guide cards are out of order"
test "$(grep -o '<a class=ref-card ' public/reference/index.html | wc -l | tr -d ' ')" -eq 2 || fail "reference index contains more than two catalogs"

# 7. Concepts introduces the major language/runtime ideas; Modules owns depth.
grep -Fq 'record Point' public/guide/05-perm-and-named/index.html || fail "concepts missing records"
grep -Fq 'attempt' public/guide/07-error-handling/index.html || fail "concepts missing attempt/rescue"
grep -Fq 'wifi.disconnected' public/guide/06-quotations-and-control/index.html || fail "concepts missing Wi-Fi events"
grep -Fq 'pad.emit-byte' public/guide/08-strings-and-io/index.html || fail "concepts missing PAD"
grep -Fq 'id=read-a-console-line-as-data' public/guide/08-strings-and-io/index.html || fail "concepts missing console data input"
grep -Fq 'console.read-line' public/reference/modules/console/index.html || fail "console module missing data input"
grep -Fq 'ble.on' public/guide/09-talking-to-hardware/index.html || fail "concepts missing Bluetooth"
grep -Fq 'Persist the Recipe, Not the Handle' public/guide/10-snapshots-and-persistence/index.html || fail "persistence guide missing volatile Handle pattern"
grep -Fq 'Do not hide this cycle inside one word' public/guide/10-snapshots-and-persistence/index.html || fail "persistence guide missing save boundary warning"
grep -Fq 'one event body per definition' public/reference/modules/events/index.html || fail "events guide omits definition limit"
for module in board gpio timing events math-and-random text-bytes-pad i2c uart pwm wifi power signals console bluetooth; do
  grep -Fq "reference/modules/${module}/" public/reference/modules/index.html || fail "modules index missing ${module}"
done

echo "smoke: OK"
