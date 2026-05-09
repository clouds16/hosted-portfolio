output "elastic_ip" {
  description = "EC2 Elastic IP — point your DNS A records here"
  value       = aws_eip.app.public_ip
}

output "ssh_command" {
  description = "SSH into the instance"
  value       = "ssh ubuntu@${aws_eip.app.public_ip}"
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.app.id
}

output "ecr_repository_url" {
  description = "ECR repository URL — set as ECR_REPOSITORY_URL in deploy workflow"
  value       = aws_ecr_repository.app.repository_url
}

output "github_deploy_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC. Empty when no pipeline is provisioned."
  value       = try(aws_iam_role.github_deploy[0].arn, "")
}

output "hosted_zone_id" {
  description = "Route 53 hosted zone ID for the domain (looked up from your account)"
  value       = data.aws_route53_zone.main.zone_id
}

output "next_steps" {
  description = "Post-apply checklist for a manual (no-CI) deploy"
  value       = <<-EOT
    ✓ Infra is up. To deploy the site (manual flow):

    1. Build + push the image to ECR (run from the project root):
         aws ecr get-login-password --region ${var.aws_region} \
           | docker login --username AWS --password-stdin ${aws_ecr_repository.app.repository_url}
         docker build -t ${var.app_name} .
         docker tag ${var.app_name}:latest ${aws_ecr_repository.app.repository_url}:latest
         docker push ${aws_ecr_repository.app.repository_url}:latest

    2. SSH in and start the systemd unit (it pulls + runs the image):
         ssh ubuntu@${aws_eip.app.public_ip}
         sudo systemctl restart ${var.app_name}
         sudo systemctl status ${var.app_name}

    3. After DNS resolves to ${aws_eip.app.public_ip}, get HTTPS:
         sudo /opt/${var.app_name}/scripts/setup-ssl.sh ${var.domain_name}

    Site will be live at:
      http://${var.domain_name}
      https://${var.domain_name}    (after step 3)
  EOT
}
