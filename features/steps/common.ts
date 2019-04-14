import { ApolloClient } from 'apollo-client';
import { After, Given, Before } from 'cucumber';
import { default as Koa } from 'koa';
import { Server } from "net";
import { Connection, createConnection } from "typeorm";
import uuid from 'uuid';
import { createApolloServer } from "../../src/createApolloServer";
import { createContextFunction } from "../../src/createContextFunction";
import { Meetup } from '../../src/types';
import { signJWT } from '../../src/users/JWT';
import { testApolloClient } from './testApolloClient';


declare module 'cucumber' {
    interface World {
        userId: string;
        server: Server;
        client: ReturnType<typeof testApolloClient>;        
        connection: Connection;  
        response: any;      
        error: any;
        meetup: Meetup;
    }
}

Given(/^a signed in user/, async function() {
    this.userId = uuid.v1();
    const token = signJWT(this.userId);
    
    this.client.updateContext('accessToken', token);
    
    // Seed data
    // TODO: use real api instead
    await this.connection.createQueryBuilder().insert().into('users').values({ id: this.userId, email: "email", password: "password" }).execute();            
});

Before(async function() {
    // Reset DB
    this.connection = await createConnection();    
    await this.connection.dropDatabase();
    await this.connection.runMigrations();

    const contextFunction = createContextFunction(this.connection);
    
    // Start server
    const port = 8888;
    const apolloServer = createApolloServer(contextFunction);
    const koaServer = new Koa();
    apolloServer.applyMiddleware({ app: koaServer })
    this.server = await koaServer.listen(port);    

    // Create test client
    this.client = testApolloClient(port);
});

After(async function() {
    if (this.server) {
        await this.server.close();
    }
    if (this.connection) {        
        await this.connection.close();        
    }    
});