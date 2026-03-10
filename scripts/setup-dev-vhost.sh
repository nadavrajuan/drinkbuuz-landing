#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-dev.drinkbuzz.com}"
WEB_ROOT="${2:-/var/www/drinkbuzz-dev}"
SITE_CONF="/etc/nginx/sites-available/${DOMAIN}.conf"
SITE_LINK="/etc/nginx/sites-enabled/${DOMAIN}.conf"

if [[ "$EUID" -ne 0 ]]; then
  echo "Run as root (or via sudo)."
  exit 1
fi

mkdir -p "${WEB_ROOT}"

cat > "$SITE_CONF" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    root ${WEB_ROOT};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }
}
NGINX

ln -sf "$SITE_CONF" "$SITE_LINK"

nginx -t
systemctl reload nginx

echo "Nginx dev vhost is active for ${DOMAIN} with root ${WEB_ROOT}"

echo "Next: issue TLS cert (recommended):"
echo "  certbot --nginx -d ${DOMAIN}"
