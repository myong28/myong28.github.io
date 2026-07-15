# maxyong.au — personal website

Static site (plain HTML/CSS/JS, no build step) hosted free on GitHub Pages at
https://github.com/myong28/myong28.github.io. Light theme "Classic Blue",
dark theme "Midnight", switchable in the nav; colors are CSS variables at the
top of `assets/css/style.css`.

```
0. Website/
├── index / writing / research / contact .html
├── data/writing.js      ★ THE FILE YOU EDIT MOST — one entry per article
├── data/research.js     Research items
├── pdfs/                Paywall-free PDF copies (writing/ and research/)
├── thumbs/              PDF previews + thumbs/web/ article share images
├── assets/img/          portrait.jpg · monogram.png · favicons · logos/
├── sitemap.xml · robots.txt
└── tools/               make-thumbnails.sh · fetch-share-images.py · make-favicons.sh
```

## Adding a new article (the frequent job)

1. Drop the PDF into `pdfs/writing/` named like `2026-08-my-article.pdf`.
2. Add an entry at the top of `data/writing.js` (template in the comment at
   the top of that file). `featured: true` puts it on the homepage (keep ~3).
3. In **Terminal**:
   ```bash
   cd "/Users/myong/My Drive/1. Documents/1. Education/3. Research/0. Website"
   bash tools/make-thumbnails.sh
   python3 tools/fetch-share-images.py
   git add . && git commit -m "Add article" && git push
   ```
   Live in ~1 minute.

## Swapping the logo/monogram

Save the new mark as `assets/img/monogram.png` (square, transparent, ≥512px),
then in **Terminal**:
```bash
cd "/Users/myong/My Drive/1. Documents/1. Education/3. Research/0. Website"
bash tools/make-favicons.sh
git add . && git commit -m "New logo" && git push
```

## Local preview

```bash
cd "/Users/myong/My Drive/1. Documents/1. Education/3. Research/0. Website"
python3 -m http.server 8000
```
Then open http://localhost:8000

---

# One-time setup: domains, migration & SEO

Do these in order. Steps 1–2 make maxyong.au live; 3–5 move your Google
standing across.

## 1. Point maxyong.au at the site

**a) At your domain registrar** (where you bought maxyong.au — e.g.
Squarespace: Domains → maxyong.au → DNS settings), add these records:

| Type  | Host / Name | Value               |
|-------|-------------|---------------------|
| A     | @           | 185.199.108.153     |
| A     | @           | 185.199.109.153     |
| A     | @           | 185.199.110.153     |
| A     | @           | 185.199.111.153     |
| CNAME | www         | myong28.github.io   |

**b) On GitHub**: https://github.com/myong28/myong28.github.io/settings/pages
→ Custom domain → type `maxyong.au` → Save. GitHub adds a `CNAME` file to the
repo (afterwards run `git pull` locally so you have it too):

```bash
cd "/Users/myong/My Drive/1. Documents/1. Education/3. Research/0. Website"
git pull
```

**c) Wait for the DNS check** on that settings page (minutes to a few hours),
then tick **Enforce HTTPS**.

Done: the site serves at https://maxyong.au and https://myong28.github.io
automatically redirects there — old links keep working.

## 2. Redirect the second domain

At the registrar for your second domain (myong.au), don't add DNS records —
use the registrar's **domain forwarding** feature (Squarespace: Domains →
domain → Forwarding): forward to `https://maxyong.au`, type **301
(permanent)**, "forward path" on if offered. A 301 tells Google it's the same
site, so it passes any standing along rather than competing.

## 3. Google Search Console (~10 minutes, highest-value step)

1. Go to https://search.google.com/search-console → Add property → choose
   **Domain** → enter `maxyong.au`.
2. It shows a TXT record — add it at the registrar's DNS settings (same place
   as step 1a), click Verify.
3. In Search Console: **Sitemaps** → submit `https://maxyong.au/sitemap.xml`.
4. **URL inspection** → enter `https://maxyong.au/` → Request indexing.

This gets the new domain indexed within days instead of weeks, and gives you
the dashboard showing exactly how you appear in Google.

## 4. Migrate from the old Google Site

Google Sites can't do real redirects, so the handover is done with links:

1. **Now**: edit https://sites.google.com/view/maxyong/home — strip it down
   to a single page saying "I've moved" with a prominent link to
   https://maxyong.au. Remove the old content so Google stops treating it as
   the canonical source (duplicate content splits your ranking).
2. **Same day**: update the website/URL field everywhere it appears —
   LinkedIn, Google Scholar profile, UniMelb Find an Expert, John Monash
   profile, The Age author bio if possible, X/Twitter, email signatures.
   This link graph is what actually transfers your search standing.
3. **In ~3–6 months**, once `maxyong.au` ranks first for "Max Yong"
   (check in Search Console), unpublish the Google Site: old site →
   Settings (gear) → ⋮ → Unpublish. Don't rush this — the pointer page does
   useful work while Google re-learns.

## 5. Keeping the knowledge panel

Knowledge panels are built from a consistent "same person" signal across the
web. The site already provides your half:

- JSON-LD `Person` markup on the homepage with `sameAs` links to LinkedIn,
  Scholar, Find an Expert, John Monash, and The Age — **keep these current**;
  they're in the `<script type="application/ld+json">` block in `index.html`.
- If you have a knowledge panel now, **claim it**: google yourself, click
  "Claim this knowledge panel", verify via your Google account. Once claimed
  you can suggest the new website URL directly.
- The reciprocal links from step 4.2 close the loop (Google sees maxyong.au
  ↔ your profiles pointing at each other).

## SEO: what's already built in

- **Structured data**: schema.org `Person` (JSON-LD) on the homepage.
- **Canonical URLs** on every page pointing to maxyong.au.
- **Open Graph tags** on every page (title/description/portrait image) — so
  shares on LinkedIn/X/Slack render rich cards.
- **sitemap.xml** + **robots.txt** (which also blocks `/pdfs/` from indexing
  so the paywall-free copies don't surface in Google against publishers'
  paywalls — visitors can still open them).
- **Unique titles + meta descriptions** per page.
- Semantic HTML (one `h1`, proper heading order), alt text on images, `lang`
  attribute, mobile responsive, and no framework bloat — the site loads fast,
  which is itself a ranking factor.

Ongoing habits that matter more than any tag:
- Keep publishing — fresh content on a domain is the strongest signal.
- When you add an article, the share image (fetched automatically) keeps
  rich previews working.
- Once a year, glance at Search Console for crawl errors.
- If you ever change domains again: update `sitemap.xml`, `robots.txt`, and
  the canonical/og/JSON-LD URLs in the four HTML files (search the repo for
  `maxyong.au`), then Search Console → Settings → Change of address.
