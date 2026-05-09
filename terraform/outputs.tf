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
  description = "IAM role ARN that GitHub Actions assumes via OIDC to push images to ECR"
  value       = aws_iam_role.github_deploy.arn
}

output "nameservers" {
  description = "Route 53 nameservers — copy these into your domain registrar's NS records"
  value       = aws_route53_zone.main.name_servers
}

output "next_steps" {
  description = "Post-apply checklist"
  sensitive   = true
  value       = <<-EOT
    ✓ Portfolio infrastructure is up. Next steps:

    1. DNS — at your domain registrar for ${var.domain_name}, replace the
       nameservers with the four from the `nameservers` output. Propagation
       usually takes a few minutes to a few hours.

    2. Add GitHub repository variables and secrets:
       (Repository → Settings → Secrets and variables → Actions)

       Variables:
         AWS_REGION              = ${var.aws_region}
         AWS_ACCOUNT_ID          = ${var.aws_account_id}
         APP_NAME                = ${var.app_name}
         ECR_REPOSITORY_URL      = ${aws_ecr_repository.app.repository_url}
         EC2_HOST                = ${aws_eip.app.public_ip}
         AWS_DEPLOY_ROLE_ARN     = ${aws_iam_role.github_deploy.arn}

       Secrets:
         EC2_SSH_KEY             = (contents of your private SSH key)

    3. Trigger first deploy:
       (Actions → Deploy → Run workflow on `main`)
       This builds the image, pushes to ECR, SSHes to EC2, pulls + restarts.

    4. Optional HTTPS (after DNS propagates and an HTTP deploy succeeds):
       ssh ubuntu@${aws_eip.app.public_ip}
       sudo /opt/${var.app_name}/scripts/setup-ssl.sh ${var.domain_name}
  EOT
}
