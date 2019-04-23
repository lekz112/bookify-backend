variable "vpc_security_group_id" {  
}

variable "db_subnet_ids" {
  type = "list"
}


resource "aws_db_instance" "bookify" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "10.6"
  instance_class       = "db.t2.micro"
  name                 = "bookify"
  username             = "postgres"
  password             = "postgres"  
  vpc_security_group_ids = ["${var.vpc_security_group_id}"]
  db_subnet_group_name = "${aws_db_subnet_group.bookify.name}"  
  skip_final_snapshot = true
  multi_az = "false"
}

resource "aws_db_subnet_group" "bookify" {
  name         = "bookify-rds-subnet-group"
  description  = "Database subnet groups for bookify"
  subnet_ids   = ["${var.db_subnet_ids}"]
}

output "db-address" {
  value = "${aws_db_instance.bookify.endpoint}"
}