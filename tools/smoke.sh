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
for needle in 'save' 'dangerous.wipe' 'gpio' 'matrix' 'blink' 'words' 'frothy'; do
  grep -qi "$needle" "$INDEX" || fail "search index missing term: $needle"
done

# 2. core routes exist (section indexes + a few representative deep pages)
for route in \
  public/index.html \
  public/install/index.html \
  public/guide/index.html \
  public/guide/01-what-is-froth/index.html \
  public/guide/12-ffi-and-c/index.html \
  public/tutorials/index.html \
  public/tutorials/blink-an-led/index.html \
  public/reference/index.html \
  public/reference/words/index.html \
  public/reference/hardware/index.html \
  public/reference/hardware/gpio/index.html \
  public/reference/ffi/index.html \
  public/machine/index.html \
  public/workshop/index.html \
  public/what-makes-frothy-different/index.html
do
  test -f "$route" || fail "missing route: $route"
done

# 3. homepage carries the new identity + interactive hooks
grep -q 'Frothy' public/index.html        || fail "homepage missing 'Frothy'"
grep -q 'data-repl-editor' public/index.html || fail "homepage missing REPL hero"
grep -q 'docs-side' public/guide/index.html || fail "guide missing sidebar"

# 4. old-URL alias for the renamed 'how it's different' page resolves
test -f public/what-makes-froth-different/index.html || fail "missing alias for old how-its-different URL"

echo "smoke: OK"
