# ─── Portfolio Site Terraform ─────────────────────────────────────────────────
# Single EC2 instance hosting a static SPA via Docker + nginx, fronted by an
# Elastic IP and Route 53. Image deployed from ECR by GitHub Actions.
#
# ── Cost estimate (us-east-1, on-demand) ──────────────────────────────────────
#   t3.micro EC2:    ~$8/mo  (free-tier eligible for first 12 months)
#   Elastic IP:      free while attached
#   8 GB gp3 EBS:    ~$0.80/mo
#   ECR:             ~$0.10/mo (10-image lifecycle policy)
#   Route 53 zone:   $0.50/mo
#   Total:           ~$9/mo (or ~$1/mo on free tier)
#
# ── What this creates ─────────────────────────────────────────────────────────
#   VPC + public subnet — isolated network
#   EC2 t3.micro        — runs the docker container (nginx + built SPA)
#   Elastic IP          — stable public IP for DNS
#   ECR                 — private container registry
#   Security group      — ports 22, 80, 443 in; all out
#   IAM role            — instance pulls image from ECR
#   GitHub OIDC role    — CI assumes this to push to ECR (no long-lived keys)
#   Route 53 A records  — apex + www → Elastic IP (when hosted_zone_id is set)
#   CloudWatch alarm    — auto-recovery on hardware failure (free)
#
# ── How to use ────────────────────────────────────────────────────────────────
#   1. Copy terraform.tfvars.example → terraform.tfvars and fill in values.
#   2. terraform init
#   3. terraform plan && terraform apply
#   4. Set GitHub Actions vars/secrets from outputs (see `next_steps` output).
#   5. Push to main — deploy.yml builds, pushes to ECR, reloads on EC2.
#   6. Optional HTTPS: sudo /opt/${app_name}/scripts/setup-ssl.sh <domain>

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = var.app_name
      ManagedBy = "Terraform"
    }
  }
}
