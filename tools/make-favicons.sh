#!/bin/bash
# Regenerates all favicon sizes from assets/img/monogram.png.
#
# To swap in a new logo later:
#   1. Save your new mark as assets/img/monogram.png
#      (square, transparent background, ideally 512x512 or larger)
#   2. Run:  bash tools/make-favicons.sh
#   3. Commit + push. Done — the nav logo and all favicons update together.

cd "$(dirname "$0")/.." || exit 1

python3 << 'EOF'
from PIL import Image

src = Image.open("assets/img/monogram.png").convert("RGBA")

def padded(size, scale):
    # Google/browsers mask favicons into circles — keep the mark inside
    # the safe zone so nothing gets amputated by the crop.
    inner = int(size * scale)
    mark = src.resize((inner, inner), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    off = (size - inner) // 2
    canvas.alpha_composite(mark, (off, off))
    return canvas

for size, name, scale in [(32, "favicon-32.png", 0.68), (192, "favicon-192.png", 0.66), (180, "apple-touch-icon.png", 0.78)]:
    img = padded(size, scale)
    if name == "apple-touch-icon.png":
        # iOS ignores transparency — give it a white plate
        plate = Image.new("RGBA", (size, size), (255, 255, 255, 255))
        plate.alpha_composite(img)
        img = plate.convert("RGB")
    img.save(f"assets/img/{name}", optimize=True)
    print("wrote", f"assets/img/{name}")

padded(48, 0.68).save(
    "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
print("wrote favicon.ico")
EOF
