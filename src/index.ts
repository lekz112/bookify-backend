import './datadog';
import { default as Koa } from 'koa';
import { default as KoaRouter } from 'koa-router';
import { createConnection, getConnectionOptions } from 'typeorm';
import { createApolloServer } from './createApolloServer';
import { createContextFunction } from "./createContextFunction";
import { EventAttendanceRepository, EventRepository } from './events';
import { UserService } from './users';
import { EventService } from './events/eventService';
import { Pool } from 'pg';

const main = async () => {
    const PORT = 8080;
    const koaServer = new Koa();    

    const router = new KoaRouter();

    router.get('/status', (ctx) => {
        ctx.body = { status: 'OK' };
    });

    koaServer.use(router.routes());
    koaServer.use(router.allowedMethods());
    // Initialize DB connection    
    
    const connection = await createConnection();    
    const pool = new Pool({
        connectionString: process.env.DB_URL
    });    
    const contextFunction = createContextFunction(connection, pool);
    const apolloServer = createApolloServer(contextFunction);
    
    apolloServer.applyMiddleware({ app: koaServer })
    koaServer.listen(PORT)

    console.info(`🚀 Apollo server running on http://localhost:${PORT}${apolloServer.graphqlPath}`);
};

main();