# Hello World ✨

A tiny single-page web app that animates the words **Hello World** in a cool way.

## Features

- **Randomized every load** — each reload picks a different entrance style, color palette, and stagger order, so no two visits look the same. Click the title to re-roll without reloading.
- **Staggered entrance** — letters fly, flip, pop, or spin into place one after another with a blur-to-sharp reveal.
- **Animated gradient text** that continuously shimmers across the chosen palette.
- **Gentle floating loop** so the title stays alive after it lands.
- **Twinkling starfield** rendered on a `<canvas>` behind the text, with stars that drift and wrap around the screen.
- **Drifting background gradient** for depth.
- **Hover a letter** to pause it and pop it forward.
- **Accessible** — honors `prefers-reduced-motion` and keeps a readable `aria-label`.

## Running it

No build step, no dependencies. Just open the file:

```bash
open index.html
```

Or serve it locally:

```bash
python3 -m http.server
# then visit http://localhost:8000
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Markup and per-letter spans |
| `styles.css` | Gradient, entrance, shimmer, and float animations |
| `script.js` | Canvas starfield |
