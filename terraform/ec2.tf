# ─── SSH Key Pair ─────────────────────────────────────────────────────────────
resource "aws_key_pair" "app" {
  key_name   = "${var.app_name}-key"
  public_key = var.ssh_public_key
  tags       = { Name = "${var.app_name}-key" }
}

# ─── EC2 Instance ─────────────────────────────────────────────────────────────
resource "aws_instance" "app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  iam_instance_profile        = aws_iam_instance_profile.ec2.name
  key_name                    = aws_key_pair.app.key_name
  associate_public_ip_address = true

  root_block_device {
    volume_size           = var.root_volume_gb
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  # Bootstrap: installs Docker + AWS CLI, writes docker-compose + systemd unit.
  # The first ECR pull happens via the deploy.yml workflow.
  user_data = templatefile("${path.module}/userdata.sh.tpl", {
    app_name           = var.app_name
    app_dir            = "/opt/${var.app_name}"
    region             = var.aws_region
    ecr_repository_url = aws_ecr_repository.app.repository_url
  })

  # Don't replace the instance if AWS releases a new AMI version.
  # Patch via OS updates (unattended-upgrades) instead.
  lifecycle {
    ignore_changes = [ami, user_data]
  }

  tags = { Name = var.app_name }
}

# ─── Elastic IP ───────────────────────────────────────────────────────────────
# Stable public IP that survives instance stop/start.
resource "aws_eip" "app" {
  instance = aws_instance.app.id
  domain   = "vpc"
  tags     = { Name = "${var.app_name}-eip" }
}

# ─── EC2 Auto-Recovery ────────────────────────────────────────────────────────
# If the underlying AWS hardware fails, EC2 automatically recovers the instance
# to new hardware with the same instance ID, EIP, and data. Free — no EC2 cost.
resource "aws_cloudwatch_metric_alarm" "ec2_recovery" {
  alarm_name          = "${var.app_name}-auto-recovery"
  namespace           = "AWS/EC2"
  metric_name         = "StatusCheckFailed_System"
  dimensions          = { InstanceId = aws_instance.app.id }
  statistic           = "Minimum"
  period              = 60
  evaluation_periods  = 2
  comparison_operator = "GreaterThanThreshold"
  threshold           = 0
  alarm_actions       = ["arn:aws:automate:${var.aws_region}:ec2:recover"]
  alarm_description   = "Auto-recover ${var.app_name} EC2 on underlying hardware failure"

  tags = { Name = "${var.app_name}-recovery-alarm" }
}
