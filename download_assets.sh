#!/bin/bash
set -e
cd "$(dirname "$0")"

mkdir -p static/images

download() {
  local name="$1"
  local uuid="$2"
  local url="https://www.figma.com/api/mcp/asset/$uuid"
  local tmp="static/images/${name}.tmp"

  ct=$(curl -sL -o "$tmp" -w "%{content_type}" "$url")

  if echo "$ct" | grep -q "png"; then ext="png"
  elif echo "$ct" | grep -qE "jpeg|jpg"; then ext="jpg"
  elif echo "$ct" | grep -q "webp"; then ext="webp"
  elif echo "$ct" | grep -q "svg"; then ext="svg"
  else ext="png"; fi

  mv "$tmp" "static/images/${name}.${ext}"
  size=$(wc -c < "static/images/${name}.${ext}" | tr -d ' ')
  echo "  ✓ ${name}.${ext}  (${size} bytes)"
}

download logo             7ab3466c-489e-43ec-b635-1b6a4a016b16
download footer-logo      1bc3b134-7bd2-4153-9837-86bd41e162f3
download can              b1e0f77e-ca76-43bf-94c3-9405c849bf14
download lifestyle-1      576d560b-cdc2-40b4-8ec6-7a5e3eb8b3b3
download lifestyle-2      f71867ac-cc9e-4dd2-89ae-7f9f590d3364
download icon-no-alcohol  723b8948-6d0f-4aab-b05e-89291297e733
download icon-no-sugar    5967723b-f8c6-410a-b7b8-e1eec405ccbb
download icon-no-caffeine ea475664-ec23-498c-b6ee-1b2b1de8583c
download icon-no-calories b6716760-4164-440a-b50e-594153235791
download functional       663e65a7-0f19-4742-b112-857b55533128
download statement-bg     50a4a36f-54a3-443d-9fa1-bbc39d998808
download award            a2289473-3ffe-406e-9d51-403a9f6233ec
download avatar           8c31ef96-73cb-4b29-ac7e-f5a8cdc9382a
download product          aa177e83-447f-445f-bb7d-9c48f03c3c7f
download subscribe-bg     d98d33f8-ba45-4f3f-aac6-3b3b2b83d329
download icon-save        6d9c19da-519c-43cb-a8af-b388d2958499
download icon-shipping    995a6003-2897-446f-8f38-cb47b09d4c34
download icon-alter       f731f685-50f9-424f-98b6-aff4c36cebd2
download icon-rewards     39feadab-0af3-4b34-8aba-367f23624aab
download retailer-1       4b5c6965-be2c-4fae-a381-02e4aaaaf5e6
download retailer-2       01af71f1-0595-4c7e-94cc-b7465789190a
download retailer-3       a1b93eaa-2024-444a-a31a-194f7dfaca5d

echo ""
echo "All done. Files in static/images/:"
ls -lh static/images/
