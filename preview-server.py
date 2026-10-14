"""Preview server for the built Won Ads website (the dist folder).

Serves ./dist with the same clean URLs as the live site:
  /services            -> services.html
  /contact?type=vip    -> contact.html (query string kept for the page's JS)
  /services.html, /services/  -> 301 to /services
  unknown paths        -> 404.html
Also supports HTTP Range requests so the hero video streams and loops properly.

Usage:  python server.py [port]      (default port 8766)
"""
import mimetypes
import os
import sys
import webbrowser
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

# Windows' registry can map .js to text/plain, which breaks ES module scripts.
TYPES = {
    ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
    ".html": "text/html", ".json": "application/json", ".svg": "image/svg+xml",
    ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg", ".gif": "image/gif", ".mp4": "video/mp4",
    ".xml": "application/xml", ".txt": "text/plain",
}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def guess_type(self, path):
        ext = os.path.splitext(path)[1].lower()
        return TYPES.get(ext) or mimetypes.guess_type(path)[0] or "application/octet-stream"

    def resolve(self):
        """Map the request path to a file inside ROOT, or None."""
        path = unquote(urlsplit(self.path).path)
        full = os.path.normpath(os.path.join(ROOT, path.lstrip("/")))
        if not full.startswith(ROOT):
            return None
        if os.path.isdir(full):
            full = os.path.join(full, "index.html")
        if os.path.isfile(full):
            return full
        if os.path.isfile(full + ".html"):
            return full + ".html"
        return None

    def do_GET(self):
        self.send_file(head_only=False)

    def do_HEAD(self):
        self.send_file(head_only=True)

    def canonical_redirect(self):
        """Like the live server: /page.html and /page/ 301 to /page."""
        parts = urlsplit(self.path)
        path = parts.path
        if path.endswith(".html") and path != "/404.html":
            target = path[:-5]
            if target.endswith("/index"):
                target = target[:-5]  # /index.html -> /, /dir/index.html -> /dir/
        elif path.endswith("/") and path != "/" and not os.path.isdir(
                os.path.join(ROOT, unquote(path).strip("/"))):
            target = path.rstrip("/")
        else:
            return False
        self.send_response(HTTPStatus.MOVED_PERMANENTLY)
        self.send_header("Location", target + (f"?{parts.query}" if parts.query else ""))
        self.send_header("Content-Length", "0")
        self.end_headers()
        return True

    def send_file(self, head_only):
        if self.canonical_redirect():
            return
        full = self.resolve()
        status = HTTPStatus.OK
        if full is None:
            full, status = os.path.join(ROOT, "404.html"), HTTPStatus.NOT_FOUND

        size = os.path.getsize(full)
        start, end = 0, size - 1
        rng = self.headers.get("Range")
        if rng and rng.startswith("bytes=") and status == HTTPStatus.OK:
            first, _, last = rng[6:].split(",")[0].partition("-")
            try:
                if first:
                    start = int(first)
                    end = min(int(last), size - 1) if last else size - 1
                else:
                    start = max(size - int(last), 0)
                if start > end or start >= size:
                    raise ValueError
            except ValueError:
                self.send_response(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                self.send_header("Content-Range", f"bytes */{size}")
                self.end_headers()
                return
            status = HTTPStatus.PARTIAL_CONTENT

        self.send_response(status)
        self.send_header("Content-Type", self.guess_type(full))
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-cache")
        if status == HTTPStatus.PARTIAL_CONTENT:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.end_headers()
        if head_only:
            return

        with open(full, "rb") as f:
            f.seek(start)
            remaining = end - start + 1
            try:
                while remaining > 0:
                    chunk = f.read(min(64 * 1024, remaining))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    remaining -= len(chunk)
            except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
                pass  # browser cancelled (normal for video seeking)


def main():
    ports = [a for a in sys.argv[1:] if a.isdigit()]
    port = int(ports[0]) if ports else 8766
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    url = f"http://127.0.0.1:{port}/"  # not "localhost": avoids a slow IPv6 attempt first
    print(f"Won Ads site running at {url}  (Ctrl+C to stop)")
    if "--no-browser" not in sys.argv:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
