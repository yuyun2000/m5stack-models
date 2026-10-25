#!/usr/bin/env python3
"""Loopback-only static preview with cache disabled for model iteration."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
p=argparse.ArgumentParser()
p.add_argument('--directory',required=True)
p.add_argument('--port',type=int,default=5187)
a=p.parse_args()
class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()
server=ThreadingHTTPServer(('127.0.0.1',a.port),partial(Handler,directory=a.directory))
print(f'M5Stack Models ready: http://127.0.0.1:{a.port}',flush=True)
server.serve_forever()
