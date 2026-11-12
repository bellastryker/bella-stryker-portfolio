# bellastryker.com

Editorial portfolio site for Isabella Stryker.
Static HTML / CSS / vanilla JS — no build step, no framework.

## File structure

```
bella-stryker-portfolio/
├── index.html        # Home
├── work.html         # Case studies + Fashion Journalism coursework (#coursework)
├── coursework.html   # Redirect stub → work.html#coursework
├── about.html        # Biography + off the clock
├── contact.html      # Contact
├── css/styles.css    # The whole design system
├── js/main.js        # Announcement bar, sticky header, mobile menu, tabs, scroll reveal
├── assets/
│   ├── images/       # Original uploads (left untouched)
│   │   └── site/     # Web-ready versions used by the redesign (rotated photos, ink logos, tile crops)
│   ├── resume.pdf
│   └── *.pdf         # Coursework PDFs
├── CNAME             # bellastryker.com
└── README.md
```

## Preview locally

Double-click `index.html`, or from this folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Publish

```bash
cd ~/Desktop/BS.com/bella-stryker-portfolio
git add -A && git commit -m "Redesign" && git push
```

GitHub Pages serves `main` at bellastryker.com — live in about a minute.

## Design system (Nov 2026 redesign)

Inspired by Cece Jewellery: quiet, editorial, image-led.

**Type** (Google Fonts)
- **Libertinus Mono** — every header, title, nav link and label, always uppercase and tracked (`--title`). It stands in for **ABC Gaisyr Semi Mono**, the paid Dinamo font Cece Jewellery uses for its titles. To use the real thing: buy a web license from Dinamo, drop the .woff2 files in `assets/fonts/`, add an `@font-face` for "ABC Gaisyr Semi Mono" at the top of `styles.css`, and put it first in `--title`.
- **EB Garamond** — body copy, links, tabs and the large centred statement (Cece's equivalent is Henry, also paid).
- **Logo** — no web font: the header uses Bella's gold sculptural BS monogram (`assets/images/site/monogram-bs.webp`, a transparent cut-out from her photo); the footer pairs it with the name in tracked title capitals.

**Palette** (CSS custom properties at the top of `styles.css`)
- `--paper` `#fcfbf9` page · `--linen` `#f4f0eb` tiles · `--sand` `#ece6de` deeper band
- `--ink` `#2f2b28` text · `--ink-soft` / `--ink-mute` secondary
- `--espresso` `#2a2623` dark tile + announcement bar · `--stone` / `--hair` rules and frames

**Components**
- `.announce` — dismissible dark bar above the header.
- `.site-header` — sticky; nav split left/right around the centred gold BS monogram; collapses to Menu / wordmark / Contact under 900px with a slide-out `.drawer`.
- `.tile--paper` + `.emboss` — the hero's blind-embossed floral frame (`assets/images/site/emboss-frame.webp`, an original olive-and-wildflower design) with the headshot set into its window. The tile carries a tactile cotton-paper tooth (`paper-texture.jpg`, tileable, hard-light over the frame and under the photo; strength via `--paper-tooth`, finer on phones).
- `.tile--video` — the hero's looping video (`assets/video/hero-ocean.mp4`, plus a lighter `-sm` file served to phones): a dusk ocean clip, stabilised by tracking the horizon and crossfaded end-to-start so the loop is seamless; poster in `assets/images/site/`. Muted autoplay; held on its first frame for visitors with reduced motion.
- `.split` + `.tile` — full-bleed 50/50 tiles. `.tile--image` (photo + scrim), `.tile--linen` (with a `.frame`d photo), `.tile--dark` (centred italic line in an engraved frame). `.tile__caption` = label + one line bottom-left, underlined `.link` bottom-right.
- `.tabs` + `.cards` — tabbed four-up grid on linen tiles. `.card__logo` (ink logo), `.card__doc` (page with shadow), `.card__alt` (image that fades in on hover; add `card--swap` to fade the logo out).
- `.values` — four-up row with monoline circle icons.
- `.statement` — centred display paragraph with italic phrases.
- `.gallery` / `.photo-grid` — personal photos with italic captions.
- `.letter` — "Curious for more?" email band.
- `.case` — case-study layout: sticky aside (No., meta, media) + main column; `.embed` browser frames scroll on hover.
- `.site-footer` — four link columns, the gold BS monogram with `BELLA STRYKER` set beneath it like a hallmark, base row. The monogram is also the favicon (`favicon.png`, `apple-touch-icon.png`) and tops the mobile menu.

**Gotchas**
- Labels inside a container that styles `p` need `p:not(.label)` on the container rule, or the label inherits body size.
- Logos in `assets/images/site/logo-*.png` are transparent, single-ink (`#2f2b28`) versions of the originals — regenerate from the originals if a brand updates its mark.
- `polaroid-1/2/6.jpeg` are stored sideways; use the rotated `site/life-*.jpg` copies.
