# Fonts

Drop the **Baste B** display face here to enable the real Frothy wordmark/hero font:

- `BasteB-Regular.otf`
- `BasteB-Medium.otf`
- `BasteB-Black.otf`

These are the user-supplied OTF files from the Claude Design project
(`_ds/frothy-design-system-.../assets/fonts/`). They are wired via `@font-face`
in `static/css/style.css`. Until they are present, the display font falls back to
**Schibsted Grotesk** (a deliberate, designed fallback — the site still looks correct).

All other fonts (Schibsted Grotesk, Plus Jakarta Sans, JetBrains Mono, Instrument Serif)
load from Google Fonts.
