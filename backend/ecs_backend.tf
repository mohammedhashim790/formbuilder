resource "aws_ecs_cluster" "backend" {
  name = "${var.project_name}-ecs-cluster"
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = 14
}

resource "aws_lb" "internal" {
  name               = "${var.project_name}-internal-alb"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_internal.id]
  subnets            = [aws_subnet.private_app_a.id, aws_subnet.private_app_b.id]
}

resource "aws_lb_target_group" "form-builders" {
  name        = "${var.project_name}-form-builders-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  health_check {
    path = "/health"
  }
}

resource "aws_lb_listener" "internal_http" {
  load_balancer_arn = aws_lb.internal.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.form-builders.arn
  }
}

resource "aws_iam_role" "ecs_task_execution" {
  name               = "${var.project_name}-ecs-task-exec-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume.json

}

data "aws_iam_policy_document" "ecs_task_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# Create ECR manually.


resource "aws_iam_role_policy_attachment" "ecs_exec_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Example: form-builder-service task definition (replicate for other services)
resource "aws_ecs_task_definition" "form-builder_service" {
  family                   = "${var.project_name}-form-builder-service"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }


  container_definitions = jsonencode([
    {
      name      = "form-builder-service"
      image     = "792856558865.dkr.ecr.us-east-1.amazonaws.com/fb-api:latest"
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.region
          awslogs-stream-prefix = "form-builder"
        }
      }
      environment = [
        { name = "PORT", value = "8080" },
        { name = "AWS_REGION", value = "us-east-1" },
        { name = "FORMS_TABLE", value = "forms" },
        { name = "FORM_CONFIGS_TABLE", value = "form_configs" },
        { name = "FIELDS_TABLE", value = "fields" },
        { name = "ASSETS_TABLE", value = "assets" },
        { name = "RULES_TABLE", value = "rules" },
        { name = "RECORDS_TABLE", value = "records" },
        { name = "REDIS_HOST", value = aws_elasticache_replication_group.redis.primary_endpoint_address },
        { name = "REDIS_PORT", value = tostring(aws_elasticache_replication_group.redis.port) },
        { name = "COGNITO_USER_POOL_ID", value = aws_cognito_user_pool.cognito.id },
        { name = "COGNITO_CLIENT_ID", value = aws_cognito_user_pool_client.client_app.id }
      ]
    }
  ])
}

resource "aws_ecs_service" "form-builder_service" {
  name            = "${var.project_name}-form-builder-service"
  cluster         = aws_ecs_cluster.backend.id
  task_definition = aws_ecs_task_definition.form-builder_service.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.private_app_a.id, aws_subnet.private_app_b.id]
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.form-builders.arn
    container_name   = "form-builder-service"
    container_port   = 8080
  }



  depends_on = [aws_lb_listener.internal_http]
}

