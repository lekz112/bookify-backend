import { ApolloServer, makeExecutableSchema } from 'apollo-server-koa';
import { importSchema } from 'graphql-import';
import { default as Koa } from 'koa';
import { default as KoaRouter } from 'koa-router';
import { meetupResolvers, meetupRepository } from './meetup'
import { MeetupRepository } from './meetup/repository/meetupRepository';

const PORT = 8080;
const koaServer = new Koa();
const router = new KoaRouter();

let typeDefs = importSchema('schema.graphql');

export interface BookifyContext {
    meetupRepository: MeetupRepository
}
const context:BookifyContext = {
    meetupRepository
}
let schema = makeExecutableSchema({ typeDefs, resolvers: meetupResolvers as any });
let apolloServer = new ApolloServer({
    schema,
    context,
    introspection: true,
    playground: true,    
    formatError: (error: any) => {
        console.log(error);
        return error;
    },
});

apolloServer.applyMiddleware({ app: koaServer })
koaServer.listen(PORT)

console.info(`🚀 Apollo server running on http://localhost:${PORT}${apolloServer.graphqlPath}`);