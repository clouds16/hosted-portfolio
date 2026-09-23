# ─── CloudFront distribution ──────────────────────────────────────────────────
# Serves the S3 bucket through global edges, terminates HTTPS, redirects HTTP
# to HTTPS, and rewrites SPA-style 404s to /index.html.

# Origin Access Control — modern replacement for OAI. Lets CloudFront sign
# requests to the private S3 bucket.
resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.app_name}-oac"
  description                       = "OAC for ${var.app_name} S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "${var.app_name} — engineerhectoralvarez.com"
  price_class         = "PriceClass_100" # US, Canada, Europe — cheapest tier

  aliases = [var.domain_name, "www.${var.domain_name}"]

  origin {
    origin_id                = "s3-${aws_s3_bucket.site.id}"
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-${aws_s3_bucket.site.id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    # CachingOptimized managed policy — sane defaults for a static site.
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  # Long-lived cache for hashed Vite assets.
  ordered_cache_behavior {
    path_pattern           = "/assets/*"
    target_origin_id       = "s3-${aws_s3_bucket.site.id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
  }

  # SPA fallback — when CloudFront can't find an object, serve index.html
  # with a 200 so React Router-style URLs work on direct visits.
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = { Name = "${var.app_name}-cdn" }
}
