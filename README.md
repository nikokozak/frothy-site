# Froth Docs

Staging Hugo source for the public Froth documentation site.

## Build

```sh
./tools/smoke.sh
```

That script:

- rebuilds the site from scratch
- verifies the expected public routes exist
- checks that the search index includes core Froth terms

## Deploy

GitHub Pages deployment lives in `.github/workflows/deploy-pages.yml`.
The public custom domain is `frothlang.org`.

## Source Of Truth

The Froth runtime repo remains canonical for semantics and accepted decisions.
This site is a public learning and reference layer over that material.

Use `_internal/source-map.md` to trace each site section back to the runtime
docs it depends on.
