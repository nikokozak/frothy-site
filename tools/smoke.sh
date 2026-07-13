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
for needle in 'save' 'dangerous.wipe' 'gpio' 'adc' 'blink' 'words' 'frothy' 'ten minutes' 'attempt' 'rescue'; do
  grep -qi "$needle" "$INDEX" || fail "search index missing term: $needle"
done

# 2. core routes exist (section indexes + a few representative deep pages)
for route in \
  public/index.html \
  public/install/index.html \
  public/editor/index.html \
  public/flash/index.html \
  public/guide/index.html \
  public/guide/01-what-is-froth/index.html \
  public/guide/12-ffi-and-c/index.html \
  public/tutorials/index.html \
  public/tutorials/blink-an-led/index.html \
  public/reference/index.html \
  public/reference/ten-minutes/index.html \
  public/reference/language/index.html \
  public/reference/words/index.html \
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

# 5. canonical tools own the public shells; /test holds internal assets only
test ! -f public/test/editor/index.html || fail "old editor shell is still public"
test ! -f public/test/flash/index.html || fail "old flasher shell is still public"

grep -q 'test/editor/style.css' public/editor/index.html || fail "editor page missing stylesheet"
grep -q 'test/editor/app.js' public/editor/index.html || fail "editor page missing script"
test -f public/test/editor/style.css || fail "missing editor stylesheet asset"
test -f public/test/editor/app.js || fail "missing editor script asset"

EDITOR_BUNDLE="$(sed -n 's#.*"\./\(vendor/frothy-editor/[^\"]*/index\.js\)".*#\1#p' static/test/editor/app.js)"
test -n "$EDITOR_BUNDLE" || fail "editor app has no pinned bundle import"
test -f "public/test/editor/$EDITOR_BUNDLE" || fail "missing pinned editor bundle: $EDITOR_BUNDLE"
grep -q 'source-form ' "public/test/editor/$EDITOR_BUNDLE" || fail "pinned editor bundle flattens multiline forms"

grep -q 'test/flash/style.css' public/flash/index.html || fail "flasher page missing stylesheet"
grep -q 'test/flash/app.js' public/flash/index.html || fail "flasher page missing script"
test -f public/test/flash/style.css || fail "missing flasher stylesheet asset"
test -f public/test/flash/app.js || fail "missing flasher script asset"
grep -q 'id=firmware-label' public/flash/index.html || fail "flasher does not render firmware label"
grep -q 'id=firmware-version' public/flash/index.html || fail "flasher does not render firmware version"
grep -q 'id=firmware-picker[^>]*>Board' public/flash/index.html || fail "flasher selector is not labeled Board"
grep -q 'Continue to Editor' public/flash/index.html || fail "flasher has no editor handoff"

node <<'NODE'
const fs = require("fs");
const path = require("path");

const manifestFile = "public/test/flash/firmware/manifest.json";
const firmwareDir = path.dirname(manifestFile);
const rows = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
if (!Array.isArray(rows) || rows.length === 0) throw new Error("firmware manifest is empty");
const boards = new Set();
const files = new Set();
for (const [rowIndex, row] of rows.entries()) {
  for (const field of ["board", "profile", "label", "version"]) {
    if (typeof row[field] !== "string" || !row[field]) {
      throw new Error(`firmware ${rowIndex} has no ${field}`);
    }
  }
  if (boards.has(row.board)) throw new Error(`manifest repeats board ${row.board}`);
  boards.add(row.board);
  if (!Array.isArray(row.segments) || row.segments.length === 0) {
    throw new Error(`firmware ${rowIndex} has no segments`);
  }
  const addresses = new Set();
  for (const segment of row.segments) {
    if (!Number.isSafeInteger(segment.address) || segment.address < 0) {
      throw new Error(`firmware ${rowIndex} has an invalid address`);
    }
    if (addresses.has(segment.address)) {
      throw new Error(`firmware ${rowIndex} repeats address ${segment.address}`);
    }
    addresses.add(segment.address);
    if (typeof segment.file !== "string" || path.basename(segment.file) !== segment.file) {
      throw new Error(`firmware ${rowIndex} has an invalid segment file`);
    }
    if (files.has(segment.file)) {
      throw new Error(`manifest repeats segment file ${segment.file}`);
    }
    files.add(segment.file);
    const segmentPath = path.join(firmwareDir, segment.file);
    if (!fs.existsSync(segmentPath) || !fs.statSync(segmentPath).isFile()) {
      throw new Error(`firmware segment is not a file: ${segment.file}`);
    }
  }
}
const bundledFiles = fs.readdirSync(firmwareDir)
  .filter((file) => file.endsWith(".bin"))
  .sort();
const referencedFiles = [...files].sort();
if (JSON.stringify(bundledFiles) !== JSON.stringify(referencedFiles)) {
  throw new Error("firmware directory and manifest segment files differ");
}
NODE

echo "smoke: OK"
