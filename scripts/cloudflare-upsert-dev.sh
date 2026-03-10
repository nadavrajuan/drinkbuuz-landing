#!/usr/bin/env bash
set -euo pipefail

: "${CF_API_TOKEN:?Missing CF_API_TOKEN}"
: "${CF_ZONE_ID:?Missing CF_ZONE_ID}"
: "${DEV_RECORD_CONTENT:?Missing DEV_RECORD_CONTENT (EC2 public IP or target hostname)}"

ROOT_DOMAIN="${ROOT_DOMAIN:-drinkbuzz.com}"
DEV_SUBDOMAIN="${DEV_SUBDOMAIN:-dev}"
DEV_RECORD_TYPE="${DEV_RECORD_TYPE:-A}"   # A or CNAME
PROXIED="${PROXIED:-false}"               # true/false
TTL="${TTL:-300}"

if [[ "$DEV_RECORD_TYPE" != "A" && "$DEV_RECORD_TYPE" != "CNAME" ]]; then
  echo "DEV_RECORD_TYPE must be A or CNAME"
  exit 1
fi

NAME="${DEV_SUBDOMAIN}.${ROOT_DOMAIN}"

api() {
  curl -sS -X "$1" "https://api.cloudflare.com/client/v4$2" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    ${3:+--data "$3"}
}

existing_json="$(api GET "/zones/${CF_ZONE_ID}/dns_records?type=${DEV_RECORD_TYPE}&name=${NAME}")"
existing_id="$(python3 - <<'PY' "$existing_json"
import json,sys
obj=json.loads(sys.argv[1])
res=obj.get('result',[])
print(res[0]['id'] if res else '')
PY
)"

payload="$(python3 - <<'PY' "$DEV_RECORD_TYPE" "$NAME" "$DEV_RECORD_CONTENT" "$TTL" "$PROXIED"
import json,sys
rtype,name,content,ttl,proxied=sys.argv[1:]
obj={
  'type': rtype,
  'name': name,
  'content': content,
  'ttl': int(ttl),
  'proxied': proxied.lower()=='true'
}
print(json.dumps(obj))
PY
)"

if [[ -n "$existing_id" ]]; then
  result="$(api PUT "/zones/${CF_ZONE_ID}/dns_records/${existing_id}" "$payload")"
  action="updated"
else
  result="$(api POST "/zones/${CF_ZONE_ID}/dns_records" "$payload")"
  action="created"
fi

ok="$(python3 - <<'PY' "$result"
import json,sys
print('true' if json.loads(sys.argv[1]).get('success') else 'false')
PY
)"

if [[ "$ok" != "true" ]]; then
  echo "Cloudflare API error:"
  echo "$result"
  exit 1
fi

echo "DNS record ${action}: ${NAME} -> ${DEV_RECORD_CONTENT} (${DEV_RECORD_TYPE}, proxied=${PROXIED})"
