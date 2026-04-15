# bellastryker.com

Editorial portfolio site for Isabella Stryker.
Static HTML / CSS / vanilla JS — no build step, no framework.

## File structure

```
BS.com/
├── index.html        # Home
├── work.html         # Portfolio / case studies
├── about.html        # Biography
├── contact.html      # Contact
├── css/
│   └── styles.css
├── js/
│   └── main.js       # Scroll reveal only
├── assets/
│   └── images/       # Drop images here when ready
├── CNAME             # Custom domain (bellastryker.com)
└── README.md
```

## Local preview

From the project folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or just double-click `index.html` — everything loads from CDN-hosted fonts.

## Deploying to GitHub Pages

1. **Create the repo.** On GitHub, create a new public repository named exactly `bellastryker.github.io` (replace with your GitHub username if different) — or any name, e.g. `portfolio`.
2. **Push these files** to the `main` branch:
   ```bash
   cd /Users/isabellastryker/Desktop/BS.com
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   git push -u origin main
   ```
3. **Turn on Pages.** In the repo on GitHub, go to **Settings → Pages**. Under *Source*, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
4. **Point the domain.** The `CNAME` file in this folder already contains `bellastryker.com`. In **Settings → Pages → Custom domain**, confirm `bellastryker.com` is set and check *Enforce HTTPS* once DNS verifies.
5. **DNS at your registrar.** Since your domain is already set up, verify the records point at GitHub Pages:
   - Four `A` records on the apex (`@`) → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One `CNAME` on `www` → `YOUR_USERNAME.github.io`

Changes pushed to `main` go live in ~1 minute.

## Adding imagery later

Each `.preview__media` and `.case__figure` block is ready for an image. Drop files into `assets/images/` and replace the empty `<div>` with an `<img>`:

```html
<div class="preview__media">
  <img src="assets/images/arella-01.jpg" alt="House of Arella" />
</div>
```

For the case-study hero figures, use a wide 16:7 composition. For preview tiles, 4:5 portrait or 5:4 landscape works best. Aim for under 300 KB per image — export at 1600px wide, quality 75–80.

## Typography

Cormorant Garamond (serif headlines) and Inter (body) are loaded from Google Fonts. No other dependencies.

## Color tokens

Defined as CSS custom properties at the top of `styles.css` — edit in one place:

- `--cream` base
- `--ink` body
- `--merlot` accent
- `--olive` secondary accent
- `--stone` and `--hair` neutrals
