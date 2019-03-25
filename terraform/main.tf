variable "ami" {
  default = "ami-0eaa3baf6969912ba"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "server_port" {
  default = "80"
}


provider "aws" {
  region = "eu-central-1"
}

data "aws_availability_zones" "all" {}

# resource "aws_instance" "example" {
#   ami = "${var.ami}"
#   instance_type = "${var.instance_type}"
#   tags {
#       Name = "example"
#   }
#   vpc_security_group_ids = ["${aws_security_group.instance.id}"]
# }

resource "aws_autoscaling_group" "example" {
  launch_configuration = "${aws_launch_configuration.example.id}"
  availability_zones = ["${data.aws_availability_zones.all.names}"]
  min_size = 2
  max_size = 4  

  load_balancers = ["${aws_elb.example.name}"]

  tag {
    key = "Name"
    value = "terraform-asg-example"
    propagate_at_launch = true
  }
}

resource "aws_launch_configuration" "example" {
  image_id = "${var.ami}"
  instance_type = "${var.instance_type}"
  security_groups = ["${aws_security_group.instance.id}"]  
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "instance" {
  name = "terraform-example-instance"
  ingress {
    from_port = "${var.server_port}"
    to_port = "${var.server_port}"
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_elb" "example" {
  name = "terraform-asg-example"
  security_groups = ["${aws_security_group.elb.id}"]
  availability_zones = ["${data.aws_availability_zones.all.names}"]

  listener {
    lb_port = 80
    lb_protocol = "http"
    instance_port = "${var.server_port}"
    instance_protocol = "http"
  }
}

resource "aws_security_group" "elb" {
  name = "terraform-example-elb"
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "availability_zones" {
    value = "${data.aws_availability_zones.all.names}"
}

output "elb_dns_name" {
  value = "${aws_elb.example.dns_name}"
}