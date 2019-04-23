data "template_file" "datadog_task_definition" {
  template = "${file("./modules/ec2/datadog_agent_ecs.json")}"

  vars {
    dd_api_key = "cfd873c458552158965b52b3d6f2e598"
  }
}

resource "aws_ecs_task_definition" "datadog" {
  family                   = "datadog-agent-task"
  container_definitions    = "${data.template_file.datadog_task_definition.rendered}"
  requires_compatibilities = ["EC2"]
  network_mode             = "bridge"  

  volume {
      name = "docker_sock"
      host_path = "/var/run/docker.sock"
  }
  volume {
      name = "proc"
      host_path = "/proc/"
  }
  volume {
      name = "cgroup"
      host_path = "/cgroup/"
  }
}

resource "aws_ecs_service" "datadog" {
  name            = "datadog"
  task_definition = "${aws_ecs_task_definition.datadog.family}"
  desired_count   = 1
  launch_type     = "EC2"
  cluster         = "${aws_ecs_cluster.bookify.id}"
  scheduling_strategy = "DAEMON"    
}

