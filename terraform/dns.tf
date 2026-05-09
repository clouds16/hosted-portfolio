# ─── Route 53 — uses your existing hosted zone ───────────────────────────────
# Domain is registered + zoned in this AWS account already, so look up the zone
# instead of creating a new one (which would require re-pointing nameservers).
data "aws_route53_zone" "main" {
  name         = var.domain_name
  private_zone = false
}

# Apex: engineerhectoralvarez.com → EIP
resource "aws_route53_record" "apex" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [aws_eip.app.public_ip]
}

# www.engineerhectoralvarez.com → EIP
resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [aws_eip.app.public_ip]
}
