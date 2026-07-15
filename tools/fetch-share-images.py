#!/usr/bin/env python3
"""Fetches each article's social-share image (og:image) into thumbs/web/.

Run from the website root after adding new articles:
    python3 tools/fetch-share-images.py

- Reads every `url:` in data/writing.js; derives the slug from the entry's
  `pdf:` filename when present, otherwise from the article URL.
- Skips images that already exist, so it's safe to re-run.
- Sites that block bots are simply skipped (the site falls back gracefully).
"""

import json
import os
import re
import sys
import urllib.request
from io import BytesIO

os.chdir(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ".")

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")

def fetch(url, binary=False, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    return data if binary else data.decode("utf-8", "ignore")

def parse_entries():
    js = open("data/writing.js").read()
    entries = []
    for block in re.findall(r"\{([^{}]*)\}", js):
        entry = dict(re.findall(r'(\w+):\s*"((?:[^"\\]|\\.)*)"', block))
        if "url" in entry:
            entries.append(entry)
    return entries

def slug_for(entry):
    if "pdf" in entry:
        return os.path.splitext(os.path.basename(entry["pdf"]))[0]
    tail = entry["url"].rstrip("/").split("/")[-1]
    tail = re.sub(r"\.html?$", "", tail)
    return re.sub(r"[^a-z0-9-]", "-", tail.lower())[:70] or "article"

def og_image(html):
    for pattern in (
        r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
        r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)',
    ):
        m = re.search(pattern, html, re.I)
        if m:
            return m.group(1).replace("&amp;", "&")
    return None

def main():
    os.makedirs("thumbs/web", exist_ok=True)
    entries = parse_entries()
    ok = skipped = failed = 0
    for e in entries:
        slug = slug_for(e)
        out = f"thumbs/web/{slug}.jpg"
        if os.path.exists(out):
            skipped += 1
            continue
        try:
            html = fetch(e["url"])
            img_url = og_image(html)
            if not img_url:
                raise ValueError("no og:image")
            raw = fetch(img_url, binary=True)
            from PIL import Image
            img = Image.open(BytesIO(raw)).convert("RGB")
            img.thumbnail((640, 640), Image.LANCZOS)
            img.save(out, "JPEG", quality=80, optimize=True)
            print(f"ok      {slug}  ({img.width}x{img.height})")
            ok += 1
        except Exception as exc:
            print(f"skip    {slug}  ({type(exc).__name__}: {exc})")
            failed += 1
    print(f"\n{ok} fetched, {skipped} already present, {failed} unavailable")

if __name__ == "__main__":
    main()
