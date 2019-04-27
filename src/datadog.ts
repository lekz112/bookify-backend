import tracer from "dd-trace";
import request from 'request';

if (process.env.NODE_ENV == 'production') {
    // For amazon ECS we need to find their private address to ship logs to
    // https://docs.datadoghq.com/integrations/amazon_ecs/?tab=python#application-container
    if (process.env.TRACE_AGENT_HOST) {
        tracer.init({ hostname: process.env.TRACE_AGENT_HOST, debug: true })    
    } else {
        request('http://169.254.169.254/latest/meta-data/local-ipv4', function (error, resp, body) {        
            tracer.init({ hostname: body, debug: true })
        });
    }        
    
} else {
    // Otherwise, assume that we are running in locally
    tracer.init({ debug: true })
} 

tracer.use("pg");
tracer.use("graphql");
tracer.use("koa");

export default tracer;