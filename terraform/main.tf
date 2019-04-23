variable "aws_region" {
  description = "Region for the VPC"
  default = "eu-central-1"
}


variable "ami" {
  default = "ami-02c40c6d994943b85"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "availability_zones" {
  default = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
}

variable "app_port" {
  description = "Port exposed by the docker image to redirect traffic to"
  default     = 8080
}

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



resource "aws_ecr_repository" "bookify" {
  name = "bookify"
}

module "ec2" {
  source = "./modules/ec2"
  ami = "${var.ami}"
  instance_type = "${var.instance_type}"
  subnet_ids = "${module.network.public_subnet_ids}"  
  lb_sg_id = "${module.network.public_security_group_id}"
  instance_sg_id ="${module.network.instance_security_group_id}"
  db_url = "postgres://postgres:postgres@${module.rds.db-address}"
  # TODO: what should be the default image to deploy?
  image = "${aws_ecr_repository.bookify.repository_url}:ca31070ebed4619a594bd48f0bc820c4d0563d84"
  vpc_id = "${module.network.vpc_id}"
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