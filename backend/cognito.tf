resource "aws_cognito_user_pool" "cognito" {
  name = "${var.project_name}-user-pool"

  auto_verified_attributes = ["email"]



  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }
}


resource "aws_cognito_user_pool_client" "client_app" {
  name                = "${var.project_name}-user-pool"
  user_pool_id        = aws_cognito_user_pool.cognito.id
  explicit_auth_flows = ["USER_PASSWORD_AUTH"]
}

