#!/usr/bin/env python3
"""LPのローカルプレビュー用サーバー。

    python3 serve.py

を実行して http://localhost:4322 を開いてください。停止は Control + C。
"""
import functools
import http.server
import os
import socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 4322


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 編集内容がすぐ反映されるようキャッシュを無効化
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # アクセスログは出さない


if __name__ == "__main__":
    os.chdir(ROOT)
    handler = functools.partial(Handler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print("D/LIGHT GYM 体験LP  →  http://localhost:%d" % PORT)
        print("(停止するには Control + C)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n停止しました。")
