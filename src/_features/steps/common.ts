import { After, Before, Given, TableDefinition } from 'cucumber';
import { default as Koa } from 'koa';
import { Server } from "net";
import { Pool } from 'pg';
import { createConnection } from "typeorm";
import { EventAttendance } from 'types';
import { createApolloServer } from "../../createApolloServer";
import { createContextFunction } from "../../createContextFunction";
import { createEventMutation } from '../queries/createMeetupMutation';
import { signUpMutation } from '../queries/signUpMutation';
import { testApolloClient } from './testApolloClient';


declare module 'cucumber' {
    interface World {
        server: Server;
        client: ReturnType<typeof testApolloClient>;
        response: any;
        reservation: EventAttendance;
        error: any;
        signedInUserEmail: string;
        userTokens: Map<string, string>;
        events: Map<string, string>;
        pool: Pool
    }
}

Before(async function () {
    // Reset DB
    this.connection = await createConnection();
    this.pool = new Pool({
        connectionString: process.env.DB_URL
    });
    await this.connection.dropDatabase();
    await this.connection.runMigrations();

    const contextFunction = createContextFunction(this.connection, this.pool);

    // Start server
    const port = 8888;
    const apolloServer = createApolloServer(contextFunction);
    const koaServer = new Koa();
    apolloServer.applyMiddleware({ app: koaServer })
    this.server = await koaServer.listen(port);

    // Create test client
    this.client = testApolloClient(port);
    this.userTokens = new Map();
    this.events = new Map();
});

After(async function () {
    if (this.server) {
        await this.server.close();
    }
    if (this.connection) {
        await this.connection.close();
    }
    await this.pool.end();
});

Given('the system has the following users:', async function (dataTable: TableDefinition) {
    await Promise.all(dataTable.hashes().map(async row => {
        const email = row['email'];
        const password = row['password'];
        const response = await this.client.mutate({ mutation: signUpMutation, variables: { email, password } });
        const token = response.data.signUp.token;
        this.userTokens.set(email, token);
    }));
});

Given('the system has the following events:', async function (dataTable: TableDefinition) {
    await Promise.all(dataTable.hashes().map(async row => {
        const name = row['name'];
        const owner = row['owner'];

        this.client.setAccessToken(this.userTokens.get(owner));
        const response = await this.client.mutate({ mutation: createEventMutation, variables: { name } });
        const eventId = response.data.createEvent.id;
        this.events.set(name, eventId);
    }));
});

Given('the user is signed in as {string}', async function (email: string) {    
    this.signedInUserEmail = email;
    this.client.setAccessToken(this.userTokens.get(email));
});