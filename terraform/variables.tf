variable "aws_region" {
  description = "Region for the VPC"
  default = "eu-central-1"
}


variable "ami" {
  default = "ami-0eaa3baf6969912ba"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "availability_zones" {
  default = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
}



variable "server_port" {
  default = "8080"
}