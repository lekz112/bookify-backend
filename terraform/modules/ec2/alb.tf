resource "aws_alb" "bookify" {
  name            = "bookify-load-balancer"
  subnets         = ["${var.subnet_ids}"]
  security_groups = ["${var.lb_sg_id}"]
}

resource "aws_alb_target_group" "bookify" {
  name        = "bookify-target-group"
  port        = 8080  # The port on which targets receive traffic
  protocol    = "HTTP"
  vpc_id      = "${var.vpc_id}"  

  health_check {    
    interval            = "30" # how often to check in seconds
    protocol            = "HTTP"
    matcher             = "200" # reponse code to amtch on
    timeout             = "10" # how long to wait till response in seconds
    path                = "/status"
    healthy_threshold   = "3" # number of checks to consider target healthy
    unhealthy_threshold = "3"
  }

  depends_on = ["aws_alb.bookify"]
}

# Redirect all traffic from the ALB to the target group
resource "aws_alb_listener" "front_end" {
  load_balancer_arn = "${aws_alb.bookify.id}"
  port              = "80" # port we are listening at
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_alb_target_group.bookify.id}"
    type             = "forward"
  }
}

output "alb_output" {
  value = "${aws_alb.bookify.dns_name}"
}