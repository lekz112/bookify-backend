variable "subnet_ids" {
  type = "list"
}

variable "lb_sg_id" {}

variable "instance_sg_id" {}

variable "ami" {}
variable "instance_type" {}
variable "db_url" {}

variable "vpc_id" {}

variable "image" {}

resource "aws_autoscaling_group" "bookify" {
  launch_configuration = "${aws_launch_configuration.bookify.id}"
  min_size             = 1
  desired_capacity     = 2
  max_size             = 3

  vpc_zone_identifier = ["${var.subnet_ids}"]

  tag {
    key                 = "Name"
    value               = "bookify"
    propagate_at_launch = true
  }
}

resource "aws_launch_configuration" "bookify" {
  image_id        = "${var.ami}"
  instance_type   = "${var.instance_type}"
  security_groups = ["${var.instance_sg_id}"]

  key_name                    = "bookify"
  associate_public_ip_address = "true"

  iam_instance_profile = "${aws_iam_instance_profile.ecs_ec2_role.id}"

  user_data = <<EOF
#!/usr/bin/env bash
echo ECS_CLUSTER=bookify >> /etc/ecs/ecs.config
  EOF

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_ecs_cluster" "bookify" {
  name = "bookify"
}

data "template_file" "bookify_task_definition" {
  template = "${file("./modules/ec2/bookify_task_definition.json.tpl")}"

  vars {
    image        = "${var.image}"
    database_url = "${var.db_url}"
    environment  = "production"
    app_port     = 8080
  }
}

resource "aws_ecs_task_definition" "bookify" {
  family                   = "bookify"
  container_definitions    = "${data.template_file.bookify_task_definition.rendered}"
  requires_compatibilities = ["EC2"]
  network_mode             = "bridge"

  #cpu                      = "256"
  #memory                   = "512"
  #execution_role_arn       = "${aws_iam_role.ecs_execution_role.arn}"
  #task_role_arn            = "${aws_iam_role.ecs_execution_role.arn}"

  # execution_role_arn = "${aws_iam_role.cluster_service_role.arn}"
  # task_role_arn      = "${aws_iam_role.cluster_service_role.arn}"
}

resource "aws_ecs_service" "bookify" {
  name            = "bookify"
  task_definition = "${aws_ecs_task_definition.bookify.family}"
  desired_count   = 2
  launch_type     = "EC2"
  cluster         = "${aws_ecs_cluster.bookify.id}"

  iam_role   = "${aws_iam_role.ecs_service_role.arn}"
  depends_on = ["aws_iam_role_policy_attachment.ecs_service_attachment"]

  #depends_on      = ["aws_iam_role_policy.ecs_service_role_policy"]


  # network_configuration {
  #   security_groups = ["${var.security_group_id}"]
  #   subnets         = ["${var.subnet_ids}"]
  # }

  load_balancer {
    target_group_arn = "${aws_alb_target_group.bookify.arn}"
    container_name   = "bookify"
    container_port   = "8080"                                # TODO: var
  }

  depends_on = ["aws_alb_target_group.bookify"]
}
