# ─── Route 53 Hosted Zone ────────────────────────────────────────────────────
# Creates a fresh zone for the domain. After apply, copy the NS records from
# the `nameservers` output to your domain registrar. DNS propagation takes
# anywhere from a few minutes to 48 hours.
resource "aws_route53_zone" "main" {
  name = var.domain_name
  tags = { Name = var.domain_name }
}

# Apex: engineerhectoralvarez.com → EIP
resource "aws_route53_record" "apex" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [aws_eip.app.public_ip]
}

# www.engineerhectoralvarez.com → EIP
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [aws_eip.app.public_ip]
}
