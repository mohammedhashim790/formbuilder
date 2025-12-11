
variable "region" {
  type    = string
  default = "us-east-1"
}
variable "profile" {
  type    = string
  default = "Mac-ap-south-1"
}


variable "project_name" {
  type    = string
  default = "formbuilder"
}

variable "vpc_cidr" {
  type = string
  # CIDAR = 16 - Default to 16.
  default = "10.0.0.0/16"
}
