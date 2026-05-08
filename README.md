# Map of the Universe — v2 (test branch)

An interactive map of ~200,000 galaxies, from the Milky Way to the edge of the observable Universe. Built from 15 years of [Sloan Digital Sky Survey](https://www.sdss.org/) data, with the cosmic microwave background from [ESA / Planck](https://www.esa.int/Science_Exploration/Space_Science/Planck/Planck_and_the_cosmic_microwave_background).

By **B. Ménard** & **N. Shtarkman**, Johns Hopkins University.

Production site: <https://mapoftheuniverse.net> (served from [bmenard1/mapoftheuniverse](https://github.com/bmenard1/mapoftheuniverse)).

This repository (`mapoftheuniverse-v2`) is a **test/staging copy** that bundles a round of corrections, performance, accessibility, and SEO improvements before merging back into the canonical repo. It is set to `noindex` so it does not compete with the production site for search traffic.

## What changed vs v1

### Correctness

- Removed `PLAGIARIZED` / `PLAGARIZED` placeholder prefixes from three live captions (Redshift, Lookback Time, Galaxies).
- Replaced placeholder location text in the "You are Here" caption (was: `Agsastarious neighborhood, in the Stamsf arm`).
- Rewrote the duplicated "Luminous Red Galaxy" caption (was a copy of the Quasars caption).
- Fixed grammar: `too faint the Sloan Digital Sky Survey telescope` → `too faint for the Sloan Digital Sky Survey telescope to detect`.
- Replaced literal "Modal Heading" placeholder text in `#myModal`.
- Replaced invalid `<it>...</it>` with `<em>...</em>`.
- Fixed `class=".d-block ..."` (leading-dot syntax error).

### Performance

- `<link rel="preconnect">` and `<link rel="preload">` for the asset origin and the hero map image.
- All `<img>` tags now use native `loading="lazy"` instead of the custom `data-src` swap-on-click hack.
- Hero map image has explicit `width`/`height` to prevent CLS, plus `fetchpriority="high"`.
- Scroll handler is wrapped in `requestAnimationFrame` and pre-caches its jQuery selectors / DOM offsets, eliminating thrashing on each scroll.
- All `console.log` debug calls stripped from `code.js`.
- Bundled Bootstrap upgraded from 5.2.0 → 5.3.3; jQuery 3.6.0 → 3.7.1.

### Accessibility & SEO

- Proper `<title>`, `<meta name="description">`, Open Graph, and Twitter Card metadata, with `og:image` set to the existing thumbnail.
- Added `<main id="main-map">` landmark and a `Skip to the map` keyboard skip-link.
- Removed the `oncontextmenu="return false"` and `dragstart preventDefault` blockers — they hurt accessibility without protecting the images.
- `<noscript>` fallback explaining what's needed.
- Canonical URL and `noindex` meta on this test repo so it doesn't compete with production.

### Code quality

- CSS: fixed `.dropdown-item { position: relative;- }` syntax error and removed the dead `border-color: var(--grey)` declaration on `hr`.
- Universe age standardised on `13.7` instead of mixing `13.7` / `13.74`.
- Hardcoded `bmenard1.github.io/mapoftheuniverse/...` image URL in `axis_set_05` switched to the same `menard.pha.jhu.edu/...` origin used everywhere else.

## Known issues still pending

- **Image cache headers**: the `menard.pha.jhu.edu` origin currently sends `Cache-Control: no-store, no-cache`, so the multi-MB PNGs are re-downloaded on every visit. Fix at the server, or move static assets to a CDN.
- **Image format**: WebMap PNGs are 2–2.5 MB each; converting to WebP/AVIF would cut transfer by ~70 %.
- **Duplicate IDs** (`text_01-04`, `map_angle_01-04`, `near-overlay`, `barone`, mobile vs desktop label IDs, etc.) are still present. They are functional but invalid HTML; a follow-up should rename or convert to classes.
- **jQuery / jQuery-UI**: still loaded. A vanilla-JS rewrite would shave ~280 KB.
- **Mobile / desktop HTML duplication**: large blocks of nearly identical markup behind `d-lg-none` / `d-none d-lg-block`. Could be unified.
- **5 separate download modals**: should be one shared modal populated from a `data-*` attribute.

## Layout

```
.
├── index.html           # Main page
├── code/code.js         # All client behaviour (jQuery)
├── style/home.css       # Main stylesheet
├── style/input.css      # Range-slider styling (currently unused — candidate for removal)
├── robots.txt           # Disallow everything (this is the test repo)
├── 404.html             # GitHub Pages 404
├── LICENSE              # All rights reserved, non-commercial use
└── README.md            # this file
```

The site does not host its own image assets; everything is loaded from `https://menard.pha.jhu.edu/MapoftheUniverse/Images/` (same as the production repo).

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

No build step.

## Credits

- Data: [Sloan Digital Sky Survey (SDSS)](https://www.sdss.org/) and [ESA / Planck](https://sci.esa.int/web/planck).
- Galaxy images: [NASA-Sloan Atlas](http://nsatlas.org/), [ESA / Hubble & NASA](https://esahubble.org/images/).
- Black hole image: [NASA / Chandra](https://www.nasa.gov/mission_pages/chandra/news/black-hole-image-makes-history).
- SDSS telescope image: [Sloan Foundation](https://sloan.org/programs/research/sloan-digital-sky-survey).

Contact: <mapoftheuniverse.net@gmail.com>
