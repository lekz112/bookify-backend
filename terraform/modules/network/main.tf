resource "aws_vpc" "main" {
  cidr_block = "${var.vpc_cidr}"
  enable_dns_hostnames = true

  tags {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "public" {
  count = "${length(var.availability_zones)}"
  vpc_id = "${aws_vpc.main.id}"
  cidr_block = "${cidrsubnet(var.vpc_cidr, 8, count.index)}"
  availability_zone = "${element(var.availability_zones, count.index)}"  

  tags {
    Name = "public subnet"
  }
}

# Define the private subnet
resource "aws_subnet" "private" {  
  count = "${length(var.availability_zones)}"
  vpc_id = "${aws_vpc.main.id}"
  cidr_block = "${cidrsubnet(var.vpc_cidr, 8, count.index + length(var.availability_zones))}"
  availability_zone = "${element(var.availability_zones, count.index)}"

  tags {
    Name = "private subnet"
  }
}


resource "aws_internet_gateway" "gw" {
  vpc_id = "${aws_vpc.main.id}"

  tags {
    Name = "VPC IGW"
  }
}

resource "aws_route_table" "public-rt" {
  vpc_id = "${aws_vpc.main.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.gw.id}"
  }

  tags {
    Name = "public RT"
  }
}

resource "aws_route_table_association" "public-rt" {
  count = "${length(var.availability_zones)}"
  subnet_id = "${element(aws_subnet.public.*.id, count.index)}"
  route_table_id = "${aws_route_table.public-rt.id}"
}

resource "aws_security_group" "public" {
  name = "sg_public"
  description = "Allow HTTP and SSH traffic"

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  vpc_id = "${aws_vpc.main.id}"
}

resource "aws_security_group" "instance" {
  name = "sg_instance"
  description = "Allows traffic from load balancer to instances"

  ingress {
    protocol    = "tcp"
    from_port   = 32768
    to_port     = 65535
    description = "Access from ALB"

    security_groups = [
      "${aws_security_group.public.id}",
    ]
  }

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  vpc_id = "${aws_vpc.main.id}"
}


resource "aws_security_group" "private" {
  name = "sg_private"
  description = "Allow traffic from public subnet"

  # Postrgres
  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks = ["${aws_subnet.public.*.cidr_block}"]
  }

  # Ping
  ingress {
    from_port = -1
    to_port = -1
    protocol = "icmp"
    cidr_blocks = ["${aws_subnet.public.*.cidr_block}"]
  }

  # SSH
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["${aws_subnet.public.*.cidr_block}"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["${aws_subnet.public.*.cidr_block}"]
  }

  vpc_id = "${aws_vpc.main.id}"

  tags {
    Name = "DB SG"
  }
}

output "private_security_group_id" {
  value = "${aws_security_group.private.id}"
}

output "private_subnet_ids" {
  value = ["${aws_subnet.private.*.id}"]
}

output "public_subnet_ids" {
  value = "${aws_subnet.public.*.id}"
}

output "public_security_group_id" {
  value = "${aws_security_group.public.id}"
}

output "instance_security_group_id" {
  value = "${aws_security_group.instance.id}"
}

output "vpc_id" {
  value = "${aws_vpc.main.id}"
}