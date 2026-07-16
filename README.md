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
   Live in ~1 minute. (Your browser caches files for 10 minutes — check in a
   private window to see changes immediately.)

## Adding research / quotes

Edit `data/research.js` — copy an existing block. Mark the main artifact link
`primary: true` (blue button). Cards can carry press pull-quotes:
```js
quotes: [ { text: "…verbatim excerpt.", source: "The Australian" } ],
```

## Swapping the logo/monogram

Save the new mark as `assets/img/monogram.png` (square, transparent, ≥512px),
then in **Terminal**:
```bash
cd "/Users/myong/My Drive/1. Documents/1. Education/3. Research/0. Website"
bash tools/make-favicons.sh
git add . && git commit -m "New logo" && git push
```
Then bump the favicon version in the four HTML files (search `?v=3`, make it
`?v=4`) so browsers refetch.

## Local preview

```bash
cd "/Users/myong/My Drive/1. Documents/1. Education/3. Research/0. Website"
python3 tools/serve.py
```
Then open http://localhost:8000 — this small server resolves the clean URLs
(/writing, /research, /contact) the same way GitHub Pages does.

---

# PART 1 — Connect maxyong.au (bought on Squarespace)

Total time: ~15 minutes of clicking, then some waiting for DNS.

### Step 1.1 — Add the DNS records in Squarespace

1. Log in to Squarespace → account menu → **Domains**
   (direct link: https://account.squarespace.com/domains)
2. Click **maxyong.au** → **DNS** (sometimes labelled "DNS Settings").
3. If there are preset records pointing at Squarespace (A records to
   198.185.159.x / 198.49.23.x, or a CNAME named `www` pointing to
   `ext-cust.squarespace.com`) — **delete those**. They're Squarespace's
   parking/website records and will conflict.
4. Click **Add record** five times and enter exactly:

   | Type  | Host  | Data / Value        |
   |-------|-------|---------------------|
   | A     | @     | 185.199.108.153     |
   | A     | @     | 185.199.109.153     |
   | A     | @     | 185.199.110.153     |
   | A     | @     | 185.199.111.153     |
   | CNAME | www   | myong28.github.io   |

   (If Squarespace shows "Host" as blank instead of `@`, leave it blank —
   same thing.)

### Step 1.2 — Tell GitHub about the domain

1. Open https://github.com/myong28/myong28.github.io/settings/pages
2. Under **Custom domain**, type `maxyong.au` → **Save**.
3. GitHub runs a DNS check. If it fails, wait 30–60 minutes and press
   "Check again" — .au DNS usually propagates fast but can take a few hours.
4. When the check passes, tick **Enforce HTTPS** (the option appears once
   GitHub has issued the certificate — up to ~1 hour after the check passes).

### Step 1.3 — Pull the CNAME file GitHub created

GitHub added a `CNAME` file to the repo. In **Terminal**:
```bash
cd "/Users/myong/My Drive/1. Documents/1. Education/3. Research/0. Website"
git pull
```

**Done.** The site now serves at https://maxyong.au, and
https://myong28.github.io automatically redirects there — every old link
keeps working. Nothing in the site's code needs changing (canonical tags,
sitemap and structured data already point at maxyong.au).

### Step 1.4 — The second .au domain (optional, when ready)

In Squarespace: Domains → the other domain → look for **Forwarding** /
"Forward domain". Forward to `https://maxyong.au`, choose **301 Permanent**.
Do NOT add the DNS records from 1.1 to this domain — forwarding only.

---

# PART 2 — Adding project sub-sites (e.g. a JRG fee explorer)

Once the custom domain is live, anything you publish on GitHub Pages under
your account automatically appears under **maxyong.au** — you never buy or
configure anything else.

### Option A — a folder in this repo (best for simple pages)

1. Create the folder with an index file:
   ```
   0. Website/jrg-fee-explorer/index.html
   ```
2. Commit + push as usual. It's live at **https://maxyong.au/jrg-fee-explorer/**
3. It has no nav link, so it's invisible until you link it. Add it to the
   relevant research card in `data/research.js`:
   ```js
   { label: "Interactive fee explorer", href: "jrg-fee-explorer/" },
   ```

### Option B — its own GitHub repo (best for real apps)

1. Create a new repo at https://github.com/new — name it e.g.
   `jrg-fee-explorer` (the name becomes the URL path).
2. Push the app's code to it. If it's plain HTML, that's all; if it's a
   React/whatever app, its build output needs to land on the branch Pages
   serves.
3. In that repo: Settings → Pages → Source: "Deploy from a branch" →
   `main` / root → Save.
4. It appears at **https://maxyong.au/jrg-fee-explorer/** automatically
   (project sites inherit the user site's custom domain).
5. Link it from `data/research.js` with the full path `jrg-fee-explorer/`.

### Can the repos be private?

- On GitHub's **free plan: no** — a repo must be **public** for GitHub Pages
  to serve it. Note this is rarely a real problem for a static site: the
  "source" is the same HTML/CSS/JS the public website already ships to every
  visitor, so making the repo public reveals nothing extra. (This main site
  repo must stay public regardless — it also holds the PDFs, which are
  already public URLs.)
- If you genuinely want private source (e.g. an app with embarrassing code
  or data-prep scripts): **GitHub Pro** (US$4/month) allows Pages from
  private repos — site stays public, source goes private. Alternative free
  pattern: keep a private repo for the messy work, and copy only the built,
  public-safe output into a public repo (or into a folder here, Option A).
- Never put actual secrets (API keys, unpublished data) in ANY Pages repo,
  public or private — everything Pages serves is world-readable by URL.

---

# PART 3 — SEO + moving over from Google Sites

### Step 3.1 — Google Search Console (~10 min, do this first)

1. Go to https://search.google.com/search-console → **Add property** →
   choose the **Domain** type → enter `maxyong.au`.
2. Google shows a TXT record. In Squarespace DNS (same screen as step 1.1),
   add it: Type **TXT**, Host **@**, Data = the `google-site-verification=…`
   string. Back in Search Console, click **Verify** (may need a few minutes).
3. In Search Console: **Sitemaps** → enter the FULL URL
   `https://maxyong.au/sitemap.xml` → Submit. (Domain properties reject the
   short `sitemap.xml` form.) If it says "could not be read" right after the
   domain went live, that's a caching race from the DNS/certificate switch —
   Google retries automatically within a day or two and it flips to Success.
4. **URL Inspection** (top bar) → paste `https://maxyong.au/` →
   **Request indexing**. Repeat for the clean URLs
   `https://maxyong.au/writing`, `/research` and `/contact` — this works
   immediately and doesn't depend on the sitemap.

   Note: the site uses extensionless URLs (`/writing`, not `/writing.html`).
   Both forms load, but canonical tags, the sitemap and all internal links
   use the clean form, so that's what Google indexes. If you already
   requested indexing on a `.html` URL, no harm — its canonical points
   Google to the clean one.

This typically gets the new domain into Google within days.

### Step 3.2 — Point the old Google Site here

Google Sites can't do real redirects, so do this by hand at
https://sites.google.com/view/maxyong/home (Edit mode):

1. Strip the homepage down to one short block: *"This site has moved →
   **maxyong.au**"* with a big link. Delete the other pages' content (keep
   the pages, empty or with the same pointer, so old deep links still land
   somewhere useful).
2. Publish. Leaving this pointer up is *good* — don't unpublish yet.

### Step 3.3 — Update your profile links (the real SEO transfer)

Same day, change the website field to `https://maxyong.au` on:
- LinkedIn (Contact info → Website)
- Google Scholar profile (Homepage field)
- UniMelb Find an Expert (ask the faculty web team if not self-serve)
- John Monash Foundation profile (email them)
- The Age author bio if the editor will update it
- Email signatures, X/Twitter bio, anywhere else

This cross-link graph — your profiles pointing at maxyong.au and the site's
JSON-LD `sameAs` pointing back at them — is what actually moves your search
ranking and sustains the knowledge panel.

### Step 3.4 — Knowledge panel

If Google shows a knowledge panel for you: search your own name, click
**Claim this knowledge panel**, verify with your Google account, then use
"Suggest edits" to set the website to maxyong.au.

### Step 3.5 — Decommission the Google Site (later)

After ~3–6 months, once searching "Max Yong" shows maxyong.au first (watch
this in Search Console → Performance), unpublish the old site:
Google Sites → Settings gear → ⋮ menu → **Unpublish**. No rush — the pointer
page keeps doing useful work until then.

### What's already SEO-optimised in the site (no action needed)

- JSON-LD `Person` structured data with `sameAs` profile links (homepage)
- Canonical URLs, unique titles + meta descriptions, Open Graph tags on
  every page (rich cards when shared on LinkedIn/X/Slack)
- `sitemap.xml` + `robots.txt` (which blocks `/pdfs/` from indexing so the
  paywall-free copies don't surface against publishers' paywalls)
- Semantic HTML, alt text, mobile responsive, near-instant load (no
  frameworks) — page speed is a ranking factor

### Ongoing habits

- Keep publishing — fresh content is the strongest signal there is.
- Glance at Search Console every few months for crawl errors.
- Keep the `sameAs` links in `index.html` current if your profiles change.
