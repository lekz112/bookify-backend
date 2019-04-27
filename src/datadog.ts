import tracer from "./dd-trace";
import request from 'request';

if (process.env.NODE_ENV == 'production') {
    // For amazon ECS we need to find their private address to ship logs to
    // https://docs.datadoghq.com/integrations/amazon_ecs/?tab=python#application-container
    request('http://169.254.169.254/latest/meta-data/local-ipv4', function (error, resp, body) {        
        tracer.init({ hostname: body })
        tracer.use("pg");
        tracer.use("graphql");
        tracer.use("koa");

    });                
} else {
    tracer.init();
}

export default tracer;