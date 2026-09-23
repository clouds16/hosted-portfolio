output "bucket_name" {
  description = "S3 bucket holding the site"
  value       = aws_s3_bucket.site.id
}

output "distribution_id" {
  description = "CloudFront distribution ID — use for cache invalidations"
  value       = aws_cloudfront_distribution.site.id
}

output "distribution_domain" {
  description = "CloudFront-assigned domain (you can hit this directly)"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_url" {
  description = "Production URL"
  value       = "https://${var.domain_name}"
}

output "deploy_command" {
  description = "Copy/paste to deploy a new build"
  value       = <<-EOT
    npm run build
    aws s3 sync dist/ s3://${aws_s3_bucket.site.id}/ --delete
    aws cloudfront create-invalidation \
      --distribution-id ${aws_cloudfront_distribution.site.id} --paths "/*"
  EOT
}
