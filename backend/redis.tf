#
# resource "aws_elasticache_subnet_group" "redis" {
#   name       = "${var.project_name}-redis-subnets"
#   subnet_ids = [aws_subnet.private_db_a.id, aws_subnet.private_db_b.id]
# }
#
# resource "aws_elasticache_replication_group" "redis" {
#   replication_group_id       = "${var.project_name}-redis"
#   description                = "Redis for unique order IDs and cache"
#   engine                     = "redis"
#   engine_version             = "7.1"
#   node_type                  = "cache.t3.micro"
#   num_node_groups            = 1
#   replicas_per_node_group    = 1
#   automatic_failover_enabled = true
#   transit_encryption_enabled = true
#   at_rest_encryption_enabled = true
#   security_group_ids         = [aws_security_group.redis.id]
#   subnet_group_name          = aws_elasticache_subnet_group.redis.name
# }
