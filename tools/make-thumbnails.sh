#!/bin/bash
# Generates first-page PNG thumbnails for every PDF that doesn't have one yet.
# Run from the website root:  bash tools/make-thumbnails.sh
# (macOS only — uses the built-in Quick Look tool, nothing to install.)

cd "$(dirname "$0")/.." || exit 1
mkdir -p thumbs

count=0
for pdf in pdfs/writing/*.pdf pdfs/research/*.pdf; do
  [ -e "$pdf" ] || continue
  base=$(basename "$pdf" .pdf)
  thumb="thumbs/$base.png"
  if [ ! -f "$thumb" ]; then
    qlmanage -t -s 480 -o thumbs "$pdf" >/dev/null 2>&1
    if [ -f "thumbs/$base.pdf.png" ]; then
      mv "thumbs/$base.pdf.png" "$thumb"
      echo "created  $thumb"
      count=$((count + 1))
    else
      echo "FAILED   $pdf"
    fi
  fi
done

echo "Done — $count new thumbnail(s)."
