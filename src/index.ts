import { ApolloServer, makeExecutableSchema } from 'apollo-server-koa';
import { importSchema } from 'graphql-import';
import { default as Koa } from 'koa';
import { default as KoaRouter } from 'koa-router';
import { meetupResolvers, PostgressMetupRepository, MeetupRepository } from './meetup'
import { createConnection } from 'typeorm';

export interface BookifyContext {
    meetupRepository: MeetupRepository
}

const main = async () => {
    const PORT = 8080;
    const koaServer = new Koa();
    const router = new KoaRouter();

    let typeDefs = importSchema('schema.graphql');
    
    const connection = await createConnection();

    const context: BookifyContext = {
        meetupRepository: new PostgressMetupRepository(connection)
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
};

main();