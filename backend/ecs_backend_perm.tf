



resource "aws_iam_role" "ecs_task_role" {
  name = "${var.project_name}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = { Service = "ecs-tasks.amazonaws.com" },
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_policy" "ecs_task_all_permissions" {
  name = "${var.project_name}-ecs-task-all"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [


      {
        Sid    = "DynamoDBCRUD",
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:ConditionCheckItem",
          "dynamodb:DescribeTable"
        ],
        Resource = [
          aws_dynamodb_table.assets.arn,
          aws_dynamodb_table.fields.arn,
          aws_dynamodb_table.form.arn,
          aws_dynamodb_table.form_configs.arn,
          aws_dynamodb_table.records.arn,
          aws_dynamodb_table.rules.arn,
        ]
      },




      {
        Sid    = "S3ListBucket",
        Effect = "Allow",
        Action = [
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ],
        Resource = [aws_s3_bucket.static.arn]
      },
      {
        Sid    = "S3ObjectCRUD",
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:AbortMultipartUpload",
          "s3:ListBucketMultipartUploads",
          "s3:ListMultipartUploadParts"
        ],
        Resource = ["${aws_s3_bucket.static.arn}/*"]
      },




      {
        Sid    = "CognitoUserPoolAdmin",
        Effect = "Allow",
        Action = [
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminUpdateUserAttributes",
          "cognito-idp:AdminDeleteUser",
          "cognito-idp:ListUsers",
          "cognito-idp:AdminDisableUser",
          "cognito-idp:AdminEnableUser",
          "cognito-idp:AdminSetUserPassword",
          "cognito-idp:AdminAddUserToGroup",
          "cognito-idp:AdminRemoveUserFromGroup"
        ],
        Resource = [aws_cognito_user_pool.cognito.arn]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_all" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_task_all_permissions.arn
}

