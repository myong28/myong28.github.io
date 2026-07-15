# maxyong.com (in waiting) — personal website

A fully static site: no build step, no frameworks, no dependencies. Open
`index.html` in a browser and it just works. Everything is plain HTML + CSS +
a small JS file that renders the article lists from two data files.

```
0. Website/
├── index.html          Home (hero, roles, featured-in, selected writing, contact)
├── writing.html        Writing & Media (filterable, grouped by year)
├── research.html       Research (papers, policy work, talks)
├── contact.html        Contact
├── data/
│   ├── writing.js      ★ THE FILE YOU EDIT MOST — one entry per article
│   └── research.js     Research items
├── pdfs/
│   ├── writing/        Paywall-free PDF copies of articles
│   └── research/       Thesis, submissions, slides
├── thumbs/             Auto-generated first-page previews (hover cards)
├── assets/
│   ├── css/style.css   All styling (design tokens at the top)
│   ├── js/main.js      Rendering + interactions (rarely needs editing)
│   └── img/            Put portrait.jpg here
└── tools/
    └── make-thumbnails.sh   Regenerates missing PDF thumbnails
```

## The most common task: adding a new article

1. **Drop the PDF** into `pdfs/writing/`, named like `2026-08-my-article.pdf`
   (year-month-short-slug, no spaces).
2. **Add an entry** at the top of `data/writing.js` — there's a copy-paste
   template in the comment at the top of that file. Set `type` to `opinion`,
   `article`, `media`, or `citation`, and optionally `featured: true` to show
   it on the homepage (keep ~3 featured).
3. **Generate the hover thumbnail**: `bash tools/make-thumbnails.sh`
4. Commit + push (see below). Done — the article appears in the right year
   group and filter automatically.

If the article has no PDF (e.g. a citation), just omit the `pdf` line.

## Adding your photo

Save a square-ish photo as `assets/img/portrait.jpg`, then in `index.html`
replace `<div class="portrait-fallback">MY</div>` with
`<img src="assets/img/portrait.jpg" alt="Max Yong">` (the comment above it
marks the spot).

## Previewing locally

Double-click `index.html`, or for a proper local server:

```bash
cd "0. Website" && python3 -m http.server 8000
# then open http://localhost:8000
```

## Publishing on GitHub Pages (free, ~5 minutes)

1. Create a repo named `<your-username>.github.io` on GitHub (public).
2. In this folder:
   ```bash
   git init
   git add .
   git commit -m "Personal website"
   git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
   git push -u origin main
   ```
3. The site is live at `https://<your-username>.github.io` within a minute or
   two. Every future `git push` updates it automatically.

### Moving to your own domain later

Zero code changes needed — the site uses only relative paths:

1. Buy a domain (e.g. maxyong.com).
2. In the GitHub repo: Settings → Pages → Custom domain → enter the domain.
3. At your registrar, add the DNS records GitHub shows you (an apex `A`/`ALIAS`
   record + a `www` CNAME), and tick "Enforce HTTPS".

## Tuning the look

All colors, radii and shadows are CSS variables at the top of
`assets/css/style.css` (`--blue-600`, `--navy-800`, etc.). Change them there
and the whole site follows.
