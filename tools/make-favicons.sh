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
for size, name in [(32, "favicon-32.png"), (192, "favicon-192.png"), (180, "apple-touch-icon.png")]:
    img = src.resize((size, size), Image.LANCZOS)
    if name == "apple-touch-icon.png":
        # iOS ignores transparency — give it a white plate
        plate = Image.new("RGBA", (size, size), (255, 255, 255, 255))
        plate.alpha_composite(img)
        img = plate.convert("RGB")
    img.save(f"assets/img/{name}", optimize=True)
    print("wrote", f"assets/img/{name}")
EOF
