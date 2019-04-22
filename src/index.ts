// import './dotenv';
import './datadog';
import { default as Koa } from 'koa';
import { createConnection, getConnectionOptions } from 'typeorm';
import { createApolloServer } from './createApolloServer';
import { createContextFunction } from "./createContextFunction";
import { MeetupAttendanceRepository, MeetupRepository } from './meetup';
import { UserService } from './users';
import { MeetupService } from './meetup/meetupService';

export type BookifyContext = {
    meetupRepository: MeetupRepository
    meetupAttendanceRepository: MeetupAttendanceRepository
    userService: UserService
    meetupService: MeetupService
    userId: string | undefined
}



const main = async () => {
    const PORT = 8080;
    const koaServer = new Koa();    

    // Initialize DB connection    
    
    const connection = await createConnection();
    const contextFunction = createContextFunction(connection);
    const apolloServer = createApolloServer(contextFunction);
    
    apolloServer.applyMiddleware({ app: koaServer })
    koaServer.listen(PORT)

    console.info(`🚀 Apollo server running on http://localhost:${PORT}${apolloServer.graphqlPath}`);
};

main();