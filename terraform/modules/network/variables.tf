variable "availability_zones" { 
    type = "list"
 }


variable "vpc_cidr" {
  description = "CIDR for the VPC"
  default = "10.0.0.0/16"
}

# variable "public_subnet_cidr_0" {
#   description = "CIDR for the public subnet"
#   default = "10.0.1.0/24"
# }

# variable "public_subnet_cidr_0" {
#   description = "CIDR for the public subnet"
#   default = "10.0.2.0/24"
# }


# variable "private_subnet_cidr_0" {
#   description = "CIDR for the private subnet 0"
#   default = "10.0.10.0/24"
# }

# variable "private_subnet_cidr_1" {
#   description = "CIDR for the private subnet 1"
#   default = "10.0.11.0/24"
# }