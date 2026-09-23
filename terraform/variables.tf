variable "aws_region" {
  description = "AWS region for the S3 bucket. CloudFront is global; ACM cert is forced to us-east-1."
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Short app name used for resource naming (lowercase, no spaces)"
  type        = string
  default     = "portfolio"
}

variable "domain_name" {
  description = "Apex domain, e.g. engineerhectoralvarez.com"
  type        = string
}
