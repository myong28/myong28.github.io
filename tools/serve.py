#!/usr/bin/env python3
"""Local preview server that behaves like GitHub Pages.

GitHub Pages serves /writing from writing.html; Python's built-in server
doesn't. This wrapper adds that, so local preview matches the live site.

Run from anywhere:
    python3 tools/serve.py
Then open http://localhost:8000
"""

import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))


class PagesHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        fs_path = super().translate_path(path)
        # /writing -> writing.html, like GitHub Pages
        if not os.path.exists(fs_path) and os.path.exists(fs_path + ".html"):
            return fs_path + ".html"
        return fs_path


if __name__ == "__main__":
    print("Serving at http://localhost:8000  (Ctrl+C to stop)")
    HTTPServer(("", 8000), PagesHandler).serve_forever()
