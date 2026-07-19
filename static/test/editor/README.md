# Frothy editor assets

Frothy App owns the browser-editor source. From the Frothy umbrella, refresh
the standalone bundle used by this page with:

```sh
npm --prefix app/assets/packages/frothy-editor ci
npm --prefix app/assets/packages/frothy-editor run build
mkdir -p site/static/test/editor/vendor/frothy-editor/0.5.4
cp app/assets/packages/frothy-editor/dist/browser/index.js \
  site/static/test/editor/vendor/frothy-editor/0.5.4/index.js
cp app/assets/packages/frothy-editor/fixtures/project-document-v1.json \
  site/static/test/editor/vendor/frothy-editor/0.5.4/project-document-v1.json
```

Update the import in `app.js`, then remove the old versioned directory. The
pinned path makes that update deliberate.
