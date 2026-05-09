# ─── EC2 Instance Role ────────────────────────────────────────────────────────
# Grants the instance pull access to its ECR repo. No long-lived AWS access
# keys live on the instance.
resource "aws_iam_role" "ec2" {
  name = "${var.app_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })

  tags = { Name = "${var.app_name}-role" }
}

resource "aws_iam_role_policy" "ec2_ecr_pull" {
  name = "${var.app_name}-ecr-pull"
  role = aws_iam_role.ec2.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["ecr:GetAuthorizationToken"]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchCheckLayerAvailability",
        ]
        Resource = aws_ecr_repository.app.arn
      },
    ]
  })
}

# SSM Session Manager — shell into the instance from the AWS console without SSH.
resource "aws_iam_role_policy_attachment" "ec2_ssm_core" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.app_name}-profile"
  role = aws_iam_role.ec2.name
  tags = { Name = "${var.app_name}-profile" }
}

# ─── GitHub Actions OIDC role (for ECR push from CI) ─────────────────────────
# Only created when github_org + github_repo are set in tfvars. With both empty
# (the default), the OIDC infra is skipped — useful when deploying manually
# without a pipeline.
locals {
  github_oidc_enabled = var.github_org != "" && var.github_repo != ""
}

resource "aws_iam_openid_connect_provider" "github" {
  count          = local.github_oidc_enabled ? 1 : 0
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  # Thumbprint for token.actions.githubusercontent.com (Amazon's published value).
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]

  tags = { Name = "${var.app_name}-github-oidc" }
}

resource "aws_iam_role" "github_deploy" {
  count = local.github_oidc_enabled ? 1 : 0
  name  = "${var.app_name}-github-deploy"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = aws_iam_openid_connect_provider.github[0].arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.github_repo}:*"
        }
      }
    }]
  })

  tags = { Name = "${var.app_name}-github-deploy" }
}

resource "aws_iam_role_policy" "github_deploy" {
  count = local.github_oidc_enabled ? 1 : 0
  name  = "${var.app_name}-github-deploy"
  role  = aws_iam_role.github_deploy[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["ecr:GetAuthorizationToken"]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage",
        ]
        Resource = aws_ecr_repository.app.arn
      },
    ]
  })
}
