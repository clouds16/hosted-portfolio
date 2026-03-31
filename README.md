# portfolio

Personal portfolio — React + Vite + TypeScript, Nginx, Docker, GitHub Actions → AWS EC2.

## Local dev
```bash
npm install && npm run dev
```

## Docker local
```bash
docker build -t portfolio . && docker run -p 8080:80 portfolio
```

## AWS EC2 one-time setup

1. Launch Ubuntu 24.04 t3.micro, open ports 22 / 80 / 443
2. SSH in and install Docker:
   ```bash
   sudo apt update && sudo apt install -y docker.io
   sudo systemctl enable --now docker
   sudo usermod -aG docker ubuntu && newgrp docker
   ```
3. Add these GitHub Actions secrets (repo → Settings → Secrets):
   - `EC2_HOST` — your EC2 public IP
   - `EC2_USER` — `ubuntu`
   - `EC2_SSH_KEY` — contents of your .pem key

Push to `main` → GitHub Actions builds image, pushes to GHCR, SSHes into EC2 and hot-swaps the container.

## Customize content
All resume data lives in `src/data.ts` — edit there, everything updates.
