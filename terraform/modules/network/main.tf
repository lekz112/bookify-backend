resource "aws_vpc" "main" {
  cidr_block = "${var.vpc_cidr}"
  enable_dns_hostnames = true

  tags {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id = "${aws_vpc.main.id}"
  cidr_block = "${var.public_subnet_cidr}"
  availability_zone = "${var.availability_zones[0]}"  

  tags {
    Name = "Web Public Subnet"
  }
}

# Define the private subnet
resource "aws_subnet" "private_0" {  
  vpc_id = "${aws_vpc.main.id}"
  cidr_block = "${var.private_subnet_cidr_0}"
  availability_zone = "${var.availability_zones[0]}"

  tags {
    Name = "Database Private Subnet 0"
  }
}

resource "aws_subnet" "private_1" {  
  vpc_id = "${aws_vpc.main.id}"
  cidr_block = "${var.private_subnet_cidr_1}"
  availability_zone = "${var.availability_zones[1]}"  

  tags {
    Name = "Database Private Subnet 1"
  }
}

# resource "aws_default_subnet" "default_${var.availability_zones[0]}" {
#   availability_zone = "${var.availability_zones[0]}"

#   tags = {
#     Name = "Default subnet for ${var.availability_zones[0]}"
#   }
# }



resource "aws_internet_gateway" "gw" {
  vpc_id = "${aws_vpc.main.id}"

  tags {
    Name = "VPC IGW"
  }
}

resource "aws_route_table" "web-public-rt" {
  vpc_id = "${aws_vpc.main.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.gw.id}"
  }

  tags {
    Name = "Public Subnet RT"
  }
}

resource "aws_route_table_association" "web-public-rt" {
  subnet_id = "${aws_subnet.public.id}"
  route_table_id = "${aws_route_table.web-public-rt.id}"
}

resource "aws_security_group" "public"{
  name = "sg_public"
  description = "Allow HTTP and SSH traffic"

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 8080
    to_port = 8080
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  vpc_id = "${aws_vpc.main.id}"

  tags {
    Name = "Public SG"
  }
}

resource "aws_security_group" "private" {
  name = "sg_private"
  description = "Allow traffic from public subnet"

  # Postrgres
  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks = ["${var.public_subnet_cidr}"]
  }

  # Ping
  ingress {
    from_port = -1
    to_port = -1
    protocol = "icmp"
    cidr_blocks = ["${var.public_subnet_cidr}"]
  }

  # SSH
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["${var.public_subnet_cidr}"]
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
  value = ["${aws_subnet.private_0.id}", "${aws_subnet.private_1.id}"]
}
