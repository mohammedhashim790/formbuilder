resource "aws_launch_template" "frontend" {
  name_prefix   = "${var.project_name}-frontend-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = "t3.nano"

  key_name = "debug-key"


  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.ec2_frontend.id]
  }

  user_data = base64encode(<<EOF
#!/bin/bash
yum update -y
yum install nginx git ec2-instance-connect nano -y

git clone https://github.com/mohammedhashim790/formbuilder.git
# Clear default nginx files and copy yours
cp -r /formbuilder/frontend/dist/frontend/browser/* /usr/share/nginx/html/

# IMPORTANT: The closing 'EOT' below must be at the very start of the line.
cat <<EOT > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Serve Angular App (Support Routing)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API calls to Internal ALB
    location /api/ {
        # Trailing slash is important to strip /api/ from the request
        proxy_pass http://${aws_lb.internal.dns_name}/;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOT

systemctl enable nginx
systemctl restart nginx
EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.project_name}-frontend"
    }
  }
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_lb" "public" {
  name               = "${var.project_name}-public-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_public.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}

resource "aws_lb_target_group" "frontend" {
  name        = "${var.project_name}-frontend-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"
  health_check {
    path = "/"
  }
}

# resource "aws_lb_target_group_attachment" "attach" {
#   target_group_arn = aws_lb_target_group.frontend.arn
#   target_id        = aws_launch_template.frontend.id
#   port             = 80
# }


resource "aws_autoscaling_group" "frontend" {
  name                = "${var.project_name}-frontend-asg"
  max_size            = 1
  min_size            = 1
  desired_capacity    = 1
  vpc_zone_identifier = [aws_subnet.public_a.id, aws_subnet.public_b.id]
  health_check_type   = "EC2"
  launch_template {
    id      = aws_launch_template.frontend.id
    version = "$Latest"
  }
  target_group_arns = [aws_lb_target_group.frontend.arn]
}

resource "aws_lb_listener" "public_http" {
  load_balancer_arn = aws_lb.public.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}




