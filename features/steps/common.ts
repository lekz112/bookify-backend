import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { After, Given } from 'cucumber';

import { default as Koa } from 'koa';
import { Server } from "net";
import { Connection, createConnection } from "typeorm";
import { createApolloServer } from "../../src/createApolloServer";
import { createContextFunction } from "../../src/createContextFunction";
import { signJWT } from '../../src/users/JWT';
import uuid from 'uuid'
import { testApolloClient } from './testApolloClient';
import { Meetup } from '../../src/types';

declare module 'cucumber' {
    interface World {
        userId: string;
        server: Server;
        client: ApolloClient<{}>;        
        connection: Connection;  
        response: any;      
        error: any;
        meetup: Meetup;
    }
}

Given(/^a signed in user/, async function() {
    this.userId = uuid.v1();
    const token = signJWT(this.userId);
    const port = 8888;    
    // Create test client
    this.client = testApolloClient(token, port);

    // Initialize DB connection    
    this.connection = await createConnection("test");    
    // Seed data
    await this.connection.createQueryBuilder().insert().into('users').values({ id: this.userId, email: "email", password: "password" }).execute();
    // Build context
    const contextFunction = createContextFunction(this.connection);
    
    // Start serever
    const apolloServer = createApolloServer(contextFunction);
    const koaServer = new Koa();
    apolloServer.applyMiddleware({ app: koaServer })
    this.server = await koaServer.listen(port);    
});

After(async function() {
    if (this.server) {
        await this.server.close();
    }
    if (this.connection) {        
        await this.connection.close();        
    }    
});