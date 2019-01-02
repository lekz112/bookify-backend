import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { After, Given } from 'cucumber';
import fetch from "isomorphic-fetch";
import { default as Koa } from 'koa';
import { Server } from "net";
import { Connection, createConnection } from "typeorm";
import { createApolloServer } from "../../src/createApolloServer";
import { createContextFunction } from "../../src/createContextFunction";
import { signJWT } from '../../src/users/JWT';
import * as util from 'util' // has no default export

declare module 'cucumber' {
    interface World {
        server: Server;
        client: ApolloClient<{}>;
        connection: Connection;
        response: any;
        userId: string;
    }
}

Given(/^a signed in user with id '(.*)'/, async function(id) {
    this.userId = id;
    const PORT = 8888;
    const token = signJWT(id);
    const koaServer = new Koa();
    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            }
        }
    });
    const httpLink = createHttpLink({
        uri: `http://localhost:${PORT}/graphql`,
        fetch
    });
    this.client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()        
    });

    // Initialize DB connection    
    this.connection = await createConnection("test");    
    // Seed data
    await this.connection.createQueryBuilder().insert().into('users').values({ id: id, email: "email", password: "password" }).execute();
    // Build context
    const contextFunction = createContextFunction(this.connection);
    const apolloServer = createApolloServer(contextFunction);
    apolloServer.applyMiddleware({ app: koaServer })

    this.server = await koaServer.listen(PORT);    
});

After(async function() {
    if (this.server) {
        await this.server.close();
    }
    if (this.connection) {        
        await this.connection.close();        
    }    
});