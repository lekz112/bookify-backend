import tracer from "dd-trace";
import request from 'request';

request('http://169.254.169.254/latest/meta-data/local-ipv4', function (error, resp, body) {
    console.info("IP: " + body)
    tracer.init({ hostname: body })
});
export default tracer;