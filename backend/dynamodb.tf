

# FORMS_TABLE=forms
# FORM_CONFIGS_TABLE=form_configs
# FIELDS_TABLE=fields
# ASSETS_TABLE=assets
# RULES_TABLE=rules
# RECORDS_TABLE=records



resource "aws_dynamodb_table" "form" {
  name         = "forms"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = { Name = "${var.project_name}-forms-table" }
}


resource "aws_dynamodb_table" "form_configs" {
  name         = "form_configs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = { Name = "${var.project_name}-form_configs-table" }
}

resource "aws_dynamodb_table" "fields" {
  name         = "fields"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = { Name = "${var.project_name}-fields-table" }
}

resource "aws_dynamodb_table" "assets" {
  name         = "assets"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = { Name = "${var.project_name}-assets-table" }
}

resource "aws_dynamodb_table" "rules" {
  name         = "rules"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }


  tags = { Name = "${var.project_name}-rules-table" }
}



resource "aws_dynamodb_table" "records" {
  name         = "records"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = { Name = "${var.project_name}-records-table" }
}

