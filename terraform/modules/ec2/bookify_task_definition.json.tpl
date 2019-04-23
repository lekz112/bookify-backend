[
    {
      "name": "bookify",
      "image": "${image}",
      "portMappings": [
        {
          "containerPort": ${app_port},
          "hostPort": 0,
          "protocol": "tcp"
        }
      ],
      "memory": 300,            
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/bookify",
          "awslogs-region": "eu-central-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "${environment}"
        },
        {
          "name": "DB_URL",
          "value": "${database_url}"
        }                        
      ]
    }
  ]