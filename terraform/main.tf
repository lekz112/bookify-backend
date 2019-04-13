provider "aws" {
  region = "${var.aws_region}"
}


# resource "aws_elb" "main" {
#   name = "bookify"
#   security_groups = ["${aws_security_group.public.id}"]  
#   # subnets = ["${aws_subnet.public.id}"]

#   listener {
#     lb_port = 80
#     lb_protocol = "http"
#     instance_port = "${var.server_port}"
#     instance_protocol = "http"
#   }
# }

# output "elb_dns_name" {
#   value = "${aws_elb.main.dns_name}"
# }

# resource "aws_security_group" "elb" {
#   name = "terraform-example-elb"
#   ingress {
#     from_port = 80
#     to_port = 80
#     protocol = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }



module "ecr" {
  source = "./modules/ecr"
}

module "rds" {
  source = "./modules/rds"
  vpc_security_group_id = "${module.network.private_security_group_id}"
  db_subnet_ids = "${module.network.private_subnet_ids}"
}

module "network" {
  source = "./modules/network"  
  availability_zones = "${var.availability_zones}"
}

output "rds-endpoint" {
  value = "${module.rds.db-address}"
}
