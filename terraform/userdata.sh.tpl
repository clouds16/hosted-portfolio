#!/bin/bash
# Portfolio first-boot bootstrap. Runs once as root via cloud-init.
#
# Responsibilities (NO source code on the host):
#   - Install Docker + AWS CLI + certbot
#   - Write docker-compose.yml + setup-ssl script
#   - Install systemd unit
#   - The systemd unit pulls the app image from ECR and starts it.
#     If the image hasn't been pushed yet (first apply), the unit's restart
#     loop retries until the deploy workflow pushes the first image.
set -euo pipefail

APP_NAME="${app_name}"
APP_DIR="${app_dir}"
REGION="${region}"
ECR_REPOSITORY_URL="${ecr_repository_url}"

log() { echo "[bootstrap] $*"; }

# ─── System packages ──────────────────────────────────────────────────────────
log "Updating system packages..."
apt-get update -y
apt-get install -y \
  ca-certificates curl gnupg jq unzip \
  awscli \
  certbot \
  unattended-upgrades

dpkg-reconfigure -f noninteractive unattended-upgrades

# ─── Docker CE ────────────────────────────────────────────────────────────────
log "Installing Docker..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -y
apt-get install -y \
  docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

systemctl enable --now docker
usermod -aG docker ubuntu

# ─── Application directory ────────────────────────────────────────────────────
mkdir -p "$APP_DIR/scripts" /var/www/certbot

# ─── docker-compose.yml ───────────────────────────────────────────────────────
# The portfolio image already bundles nginx + the built SPA. The container
# listens on port 8080; the host publishes 80 → 8080. SSL terminates on the
# host (see setup-ssl.sh) which proxies through this port.
log "Writing docker-compose.yml..."
cat > "$APP_DIR/docker-compose.yml" <<COMPOSE
services:
  portfolio:
    image: $ECR_REPOSITORY_URL:latest
    ports:
      - "8080:80"
    restart: always
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:80/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
COMPOSE

# ─── Host nginx (terminates TLS, reverse-proxies to container on 8080) ───────
# The container itself ships with nginx serving the SPA on :80, but we want
# Let's Encrypt to live on the host so cert renewals don't depend on the
# container. Host nginx listens on 80/443 and proxies to 127.0.0.1:8080.
log "Installing host nginx..."
apt-get install -y nginx
systemctl enable nginx

cat > /etc/nginx/sites-available/portfolio <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # ACME challenge for certbot renewals
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# ─── SSL setup script (run manually after first successful HTTP deploy) ──────
log "Writing setup-ssl script..."
cat > "$APP_DIR/scripts/setup-ssl.sh" <<'SSLSETUP'
#!/usr/bin/env bash
# Obtain a Let's Encrypt cert and switch host nginx to HTTPS.
# Usage: sudo /opt/portfolio/scripts/setup-ssl.sh <apex-domain>
#   e.g. sudo /opt/portfolio/scripts/setup-ssl.sh engineerhectoralvarez.com
set -euo pipefail
DOMAIN="$${1:?usage: setup-ssl.sh <apex-domain>}"

certbot certonly --webroot -w /var/www/certbot \
  -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos -m "admin@$DOMAIN" \
  --keep-until-expiring

cat > /etc/nginx/sites-available/portfolio <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://\$host\$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate     /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host              \$host;
        proxy_set_header X-Real-IP         \$remote_addr;
        proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX

nginx -t && systemctl reload nginx
echo "[setup-ssl] HTTPS active for $DOMAIN (and www.$DOMAIN)"
SSLSETUP
chmod +x "$APP_DIR/scripts/setup-ssl.sh"

# ─── systemd unit ─────────────────────────────────────────────────────────────
log "Writing systemd unit..."
cat > "/etc/systemd/system/$APP_NAME.service" <<UNIT
[Unit]
Description=$APP_NAME (Docker Compose)
After=docker.service network-online.target
Requires=docker.service
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR

ExecStartPre=/bin/bash -c 'aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URL'
ExecStartPre=-/usr/bin/docker compose -f $APP_DIR/docker-compose.yml pull
ExecStart=/usr/bin/docker compose -f $APP_DIR/docker-compose.yml up -d

ExecStop=/usr/bin/docker compose -f $APP_DIR/docker-compose.yml down

ExecReload=/bin/bash -c 'aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URL'
ExecReload=/usr/bin/docker compose -f $APP_DIR/docker-compose.yml pull
ExecReload=/usr/bin/docker compose -f $APP_DIR/docker-compose.yml up -d --remove-orphans

Restart=on-failure
RestartSec=30

[Install]
WantedBy=multi-user.target
UNIT

chown -R ubuntu:ubuntu "$APP_DIR"

systemctl daemon-reload
systemctl enable "$APP_NAME"
systemctl start "$APP_NAME" || log "(initial start may fail until first image is pushed; deploy workflow will retry)"

log "Bootstrap complete."
log "First deploy: trigger the 'Deploy' GitHub Action."
log "HTTPS later:  sudo $APP_DIR/scripts/setup-ssl.sh engineerhectoralvarez.com"
