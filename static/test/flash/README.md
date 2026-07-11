# Frothy flasher assets

These files support FrothySite's `/flash/` page, which flashes Frothy firmware
to an ESP32 board over WebSerial and then links to the browser editor.

## Serve locally

```sh
./tools/smoke.sh
python3 -m http.server --directory public 8000
```

Open `http://127.0.0.1:8000/flash/` in a desktop browser with WebSerial
support. `file://` does not work because ES modules and WebSerial need an HTTP
origin.

## Hosted

The public flasher is at `https://frothy.dev/flash/`.

## esptool-js

`vendor/esptool-js/0.6.0/bundle.js` is the unmodified `package/bundle.js`
file from the v0.6.0 release at
https://github.com/espressif/esptool-js/releases/tag/v0.6.0 (217,616
bytes). The page imports it as an ES module — no CDN fetch at flash
time. To update, drop the new bundle in a sibling
`vendor/esptool-js/<version>/` directory, bump the import in `app.js`,
and update this note.
