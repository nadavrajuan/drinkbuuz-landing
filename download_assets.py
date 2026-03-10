#!/usr/bin/env python3
"""Download all Figma assets referenced by the landing page."""
import os
import sys
import urllib.request

ASSETS = {
    "logo":              "7ab3466c-489e-43ec-b635-1b6a4a016b16",
    "footer-logo":       "1bc3b134-7bd2-4153-9837-86bd41e162f3",
    "can":               "b1e0f77e-ca76-43bf-94c3-9405c849bf14",
    "lifestyle-1":       "576d560b-cdc2-40b4-8ec6-7a5e3eb8b3b3",
    "lifestyle-2":       "f71867ac-cc9e-4dd2-89ae-7f9f590d3364",
    "icon-no-alcohol":   "723b8948-6d0f-4aab-b05e-89291297e733",
    "icon-no-sugar":     "5967723b-f8c6-410a-b7b8-e1eec405ccbb",
    "icon-no-caffeine":  "ea475664-ec23-498c-b6ee-1b2b1de8583c",
    "icon-no-calories":  "b6716760-4164-440a-b50e-594153235791",
    "functional":        "663e65a7-0f19-4742-b112-857b55533128",
    "statement-bg":      "50a4a36f-54a3-443d-9fa1-bbc39d998808",
    "award":             "a2289473-3ffe-406e-9d51-403a9f6233ec",
    "avatar":            "8c31ef96-73cb-4b29-ac7e-f5a8cdc9382a",
    "product":           "aa177e83-447f-445f-bb7d-9c48f03c3c7f",
    "subscribe-bg":      "d98d33f8-ba45-4f3f-aac6-3b3b2b83d329",
    "icon-save":         "6d9c19da-519c-43cb-a8af-b388d2958499",
    "icon-shipping":     "995a6003-2897-446f-8f38-cb47b09d4c34",
    "icon-alter":        "f731f685-50f9-424f-98b6-aff4c36cebd2",
    "icon-rewards":      "39feadab-0af3-4b34-8aba-367f23624aab",
    "retailer-1":        "4b5c6965-be2c-4fae-a381-02e4aaaaf5e6",
    "retailer-2":        "01af71f1-0595-4c7e-94cc-b7465789190a",
    "retailer-3":        "a1b93eaa-2024-444a-a31a-194f7dfaca5d",
}

EXT_MAP = {
    "image/png":  "png",
    "image/jpeg": "jpg",
    "image/jpg":  "jpg",
    "image/webp": "webp",
    "image/svg+xml": "svg",
}

os.makedirs("static/images", exist_ok=True)

results = {}
for name, uuid in ASSETS.items():
    url = f"https://www.figma.com/api/mcp/asset/{uuid}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            ct = resp.headers.get_content_type() or ""
            ext = EXT_MAP.get(ct, "png")
            data = resp.read()
        path = f"static/images/{name}.{ext}"
        with open(path, "wb") as f:
            f.write(data)
        results[name] = (path, ext, len(data))
        print(f"  ✓ {name}.{ext}  ({len(data):,} bytes)")
    except Exception as e:
        print(f"  ✗ {name}: {e}", file=sys.stderr)
        results[name] = (None, None, 0)

ok  = sum(1 for v in results.values() if v[0])
fail = len(results) - ok
print(f"\n{ok}/{len(results)} downloaded" + (f", {fail} failed" if fail else ""))
