import { After, Before, Given, TableDefinition } from 'cucumber';
import { default as Koa } from 'koa';
import { Meetup } from 'meetup/meetup';
import { Server } from "net";
import { Connection, createConnection } from "typeorm";
import uuid from 'uuid';
import { createApolloServer } from "../../src/createApolloServer";
import { createContextFunction } from "../../src/createContextFunction";
import { signJWT } from '../../src/users/JWT';
import { testApolloClient } from './testApolloClient';
import { signUpMutation } from '../queries/signUpMutation';
import { createMeetupMutation } from '../queries/createMeetupMutation';
import { User, MeetupAttendance } from 'types';
import { Pool } from 'pg';


declare module 'cucumber' {
    interface World {
        server: Server;
        client: ReturnType<typeof testApolloClient>;
        response: any;
        reservation: MeetupAttendance;
        error: any;
        signedInUserEmail: string;
        userTokens: Map<string, string>;
        meetups: Map<string, string>;
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
    this.meetups = new Map();
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

Given('the system has the following meetups:', async function (dataTable: TableDefinition) {
    await Promise.all(dataTable.hashes().map(async row => {
        const name = row['name'];
        const owner = row['owner'];

        this.client.setAccessToken(this.userTokens.get(owner));
        const response = await this.client.mutate({ mutation: createMeetupMutation, variables: { name } });
        const meetupId = response.data.createMeetup.id;
        this.meetups.set(name, meetupId);
    }));
});

Given('the user is signed in as {string}', async function (email: string) {    
    this.signedInUserEmail = email;
    this.client.setAccessToken(this.userTokens.get(email));
});