# ─── Portfolio Site Terraform (S3 + CloudFront tier) ──────────────────────────
# Static SPA hosted on S3, fronted globally by CloudFront with HTTPS via ACM.
#
# ── Cost estimate (us-east-1) ─────────────────────────────────────────────────
#   S3 storage (~5 MB build):          ~$0.001/mo
#   S3 GET requests (low traffic):     ~$0.001/mo
#   CloudFront egress:                 1 TB/mo always-free → $0
#   CloudFront requests:               10M HTTPS reqs/mo always-free → $0
#   ACM certificate:                   free
#   Route 53 alias records:            free (no per-query charge for AWS aliases)
#   ──────────────────────────────────────
#   Total:                             ~$0.50/mo (essentially S3 + invalidations)
#
# ── What this creates ─────────────────────────────────────────────────────────
#   S3 bucket           — private, holds the Vite `dist/` output
#   Origin Access Ctrl  — locks the bucket so only CloudFront can read it
#   CloudFront dist     — global edge caching, HTTPS termination, SPA fallback
#   ACM cert            — validated via Route 53 DNS (must live in us-east-1)
#   Route 53 aliases    — apex + www → CloudFront
#
# ── How to deploy a new version ───────────────────────────────────────────────
#   npm run build
#   aws s3 sync dist/ s3://$(terraform -chdir=terraform output -raw bucket_name)/ --delete
#   aws cloudfront create-invalidation \
#     --distribution-id $(terraform -chdir=terraform output -raw distribution_id) \
#     --paths "/*"

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
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

# CloudFront-bound certificates MUST live in us-east-1 regardless of where the
# rest of the infra runs. This aliased provider exists for that one purpose.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = var.app_name
      ManagedBy = "Terraform"
    }
  }
}
