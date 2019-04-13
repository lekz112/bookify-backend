
resource "aws_autoscaling_group" "bookify" {
  launch_configuration = "${aws_launch_configuration.bookify.id}"  
  min_size = 1
  max_size = 1  

  vpc_zone_identifier = ["${aws_subnet.public.id}"]
  # load_balancers = ["${aws_elb.main.name}"]

  tag {
    key = "Name"
    value = "bookify"
    propagate_at_launch = true
  }
}

resource "aws_launch_configuration" "bookify" {
  image_id = "${var.ami}"
  instance_type = "${var.instance_type}"
  security_groups = ["${aws_security_group.public.id}"]

  key_name = "bookify"  
  # associate_public_ip_address = "true"    
  
  lifecycle {
    create_before_destroy = true
  }
}