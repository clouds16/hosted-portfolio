variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Short app name used for resource naming (lowercase, no spaces)"
  type        = string
  default     = "portfolio"
}

variable "aws_account_id" {
  description = "Your 12-digit AWS account ID"
  type        = string
  sensitive   = true
}

# ─── EC2 instance ─────────────────────────────────────────────────────────────
variable "instance_type" {
  description = "EC2 instance type. t3.micro (~$8/mo, free-tier eligible) is plenty for a static SPA."
  type        = string
  default     = "t3.micro"
}

variable "ssh_public_key" {
  description = "Your SSH public key string (contents of ~/.ssh/id_ed25519.pub or similar)"
  type        = string
}

variable "ssh_allowed_cidrs" {
  description = "CIDR blocks allowed to SSH. Restrict to your IP for security: [\"1.2.3.4/32\"]"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "root_volume_gb" {
  description = "Root EBS volume size in GB"
  type        = number
  default     = 8
}

# ─── DNS ──────────────────────────────────────────────────────────────────────
variable "domain_name" {
  description = "Apex domain, e.g. engineerhectoralvarez.com"
  type        = string
  default     = "engineerhectoralvarez.com"
}

# ─── GitHub Actions OIDC (for ECR push from CI) ───────────────────────────────
variable "github_org" {
  description = "GitHub username or organization name (for OIDC trust)"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name without org prefix (for OIDC trust)"
  type        = string
}
