# resource "aws_launch_template" "frontend" {
#   name_prefix   = "${var.project_name}-frontend-"
#   image_id      = data.aws_ami.amazon_linux.id
#   instance_type = "t3.micro"
#
#   network_interfaces {
#     associate_public_ip_address = true
#     security_groups             = [aws_security_group.ec2_frontend.id]
#   }
#
#   user_data = base64encode(<<EOF
# #!/bin/bash
# yum update -y
# # install nginx / node / whatever and start your frontend here
# EOF
#   )
#
#   tag_specifications {
#     resource_type = "instance"
#     tags = {
#       Name = "${var.project_name}-frontend"
#     }
#   }
# }
#
# data "aws_ami" "amazon_linux" {
#   most_recent = true
#   owners      = ["amazon"]
#   filter {
#     name   = "name"
#     values = ["al2023-ami-*-x86_64"]
#   }
# }
#
# resource "aws_lb" "public" {
#   name               = "${var.project_name}-public-alb"
#   internal           = false
#   load_balancer_type = "application"
#   security_groups    = [aws_security_group.alb_public.id]
#   subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]
# }
#
# resource "aws_lb_target_group" "frontend" {
#   name        = "${var.project_name}-frontend-tg"
#   port        = 80
#   protocol    = "HTTP"
#   vpc_id      = aws_vpc.main.id
#   target_type = "instance"
#   health_check {
#     path = "/"
#   }
# }
#
# resource "aws_autoscaling_group" "frontend" {
#   name                = "${var.project_name}-frontend-asg"
#   max_size            = 3
#   min_size            = 2
#   desired_capacity    = 2
#   vpc_zone_identifier = [aws_subnet.public_a.id, aws_subnet.public_b.id]
#   health_check_type   = "EC2"
#   launch_template {
#     id      = aws_launch_template.frontend.id
#     version = "$Latest"
#   }
#   target_group_arns = [aws_lb_target_group.frontend.arn]
# }
#
# resource "aws_lb_listener" "public_http" {
#   load_balancer_arn = aws_lb.public.arn
#   port              = 80
#   protocol          = "HTTP"
#
#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.frontend.arn
#   }
# }
#
#
#
#
