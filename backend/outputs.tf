
# output "public_alb_dns" {
#   value = aws_lb.public.dns_name
# }
#
# output "cloudfront_domain" {
#   value = aws_cloudfront_distribution.static.domain_name
# }



output "redis_host" {
  value = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "redis_host_port" {
  value = aws_elasticache_replication_group.redis.port
}


output "cognito_user_pool" {
  value = aws_cognito_user_pool.cognito.id
}
output "cognito_user_pool_client" {
  value = aws_cognito_user_pool_client.client_app.id
}

output "alb_dns_name" {
  description = "The DNS name of the Public Fronload balancer"
  value       = aws_lb.public.dns_name
}





