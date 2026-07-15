# maxyong personal website

A fully static site: no build step, no frameworks, no dependencies. Open
`index.html` in a browser and it just works. Everything is plain HTML + CSS +
a small JS file that renders the article lists from two data files.

Light theme = "Classic Blue", dark theme = "Midnight". The site follows the
visitor's system preference and has a toggle in the nav; both palettes are
defined as CSS variables at the top of `assets/css/style.css`.

```
0. Website/
├── index.html          Home (hero, roles, featured-in, selected writing, research, contact)
├── writing.html        Writing & Media (filterable, grouped by year)
├── research.html       Research (papers, policy work, talks)
├── contact.html        Contact
├── data/
│   ├── writing.js      ★ THE FILE YOU EDIT MOST — one entry per article
│   └── research.js     Research items
├── pdfs/
│   ├── writing/        Paywall-free PDF copies of articles
│   └── research/       Thesis, submissions, slides
├── thumbs/             Auto-generated PDF first-page previews
│   └── web/            Auto-fetched article share images (hover previews + cards)
├── assets/
│   ├── css/style.css   All styling (light + dark tokens at the top)
│   ├── js/main.js      Rendering + interactions (rarely needs editing)
│   └── img/            portrait.jpg, monogram.png, favicons, logos/
├── sitemap.xml, robots.txt
└── tools/
    ├── make-thumbnails.sh      PDF first-page thumbnails (macOS Quick Look)
    ├── fetch-share-images.py   Article share images (og:image)
    └── make-favicons.sh        Favicon set from assets/img/monogram.png
```

## The most common task: adding a new article

1. **Drop the PDF** into `pdfs/writing/`, named like `2026-08-my-article.pdf`
   (year-month-short-slug, no spaces).
2. **Add an entry** at the top of `data/writing.js` — there's a copy-paste
   template in the comment at the top of that file. Set `type` to `opinion`,
   `article`, `media`, or `citation`, and optionally `featured: true` to show
   it on the homepage (keep ~3 featured).
3. **Generate previews**:
   ```bash
   bash tools/make-thumbnails.sh          # PDF hover preview
   python3 tools/fetch-share-images.py    # article share image (hover + cards)
   ```
4. Commit + push. The article appears in the right year group and filter
   automatically.

If the article has no PDF (e.g. a citation), just omit the `pdf` line.

## Swapping in a new logo / monogram

1. Save your new mark as `assets/img/monogram.png` — square, transparent
   background, ideally 512×512 or larger.
2. Run `bash tools/make-favicons.sh` (regenerates the favicon sizes).
3. Commit + push. The nav logo and browser-tab icons update together.
   If the new mark is dark and hard to see in dark mode, adjust the
   `[data-theme="dark"] .nav__brand img { filter: … }` rule in style.css.

## Changing the photo

Replace `assets/img/portrait.jpg` (square, ≥720px). The homepage hero uses it
directly.

## Previewing locally

Double-click `index.html`, or for a proper local server:

```bash
cd "0. Website" && python3 -m http.server 8000
# then open http://localhost:8000
```

## Publishing

The site lives at https://github.com/myong28/myong28.github.io and deploys
automatically on every push to `main`:

```bash
git add .
git commit -m "Add article"
git push
```

Live at https://myong28.github.io within a minute or two.

## When you buy a domain

Zero code changes needed — the site uses only relative paths:

1. GitHub repo → Settings → Pages → Custom domain → enter the domain
   (GitHub creates a CNAME file in the repo).
2. At your registrar, add the DNS records GitHub shows you: four apex `A`
   records (185.199.108.153 … 111.153) + a `www` CNAME to
   `myong28.github.io`. Tick "Enforce HTTPS" once the certificate issues.
3. Update the absolute URLs in `sitemap.xml`, `robots.txt`, and the
   `<link rel="canonical">` / JSON-LD / og:image tags in the four HTML pages
   (search for `myong28.github.io`).

## SEO / knowledge panel notes

- The homepage carries JSON-LD `Person` markup whose `sameAs` links (LinkedIn,
  Google Scholar, Find an Expert, John Monash, The Age author page) are what
  Google uses to connect your profiles — keep them current.
- Register the site in **Google Search Console** (verify via a meta tag or
  DNS) and submit `sitemap.xml` — do this once, and again after a domain move.
- Google Sites can't redirect. To migrate SEO standing: edit the old Google
  Site so its homepage prominently links to this site, and update the website
  field on LinkedIn / Scholar / Find an Expert / John Monash to point here.
  The consistent cross-link graph is what sustains the knowledge panel.
- `robots.txt` disallows `/pdfs/` so search engines don't index the
  paywall-free article copies directly (visitors can still open them).
