import { ApolloServer, makeExecutableSchema } from 'apollo-server-koa';
import { importSchema } from 'graphql-import';
import { default as Koa } from 'koa';
import { default as KoaRouter } from 'koa-router';
import { meetupResolvers, PostgressMetupRepository, MeetupRepository } from './meetup'
import { userResolvers, UserService } from './users'
import { createConnection } from 'typeorm';
import { PostgressUsersRepository } from './users/postgressUsersRepository';

type KoaContext = import('koa').Context;

export interface BookifyContext {
    meetupRepository: MeetupRepository
    userService: UserService
}

const extractBearerToken = (header: string): string | undefined => {
    if (!header) return;

    const bearerMatch = /^Bearer (.*)$/;
    const matches = header.match(bearerMatch);

    if (matches && matches[1]) {
        return matches[1];
    }

    return;
};

const main = async () => {
    const PORT = 8080;
    const koaServer = new Koa();
    const router = new KoaRouter();

    let typeDefs = importSchema('schema.graphql');

    // Initialize DB connection
    const connection = await createConnection();

    let schema = makeExecutableSchema({ typeDefs, resolvers: [meetupResolvers, userResolvers] as any });
    let apolloServer = new ApolloServer({
        schema,
        context: async ({ ctx }: { ctx: KoaContext }) => {
            const authorizationHeader = ctx.get('Authorization');
            const bearerToken = extractBearerToken(authorizationHeader);


            return {
                meetupRepository: new PostgressMetupRepository(connection),
                userService: new UserService(new PostgressUsersRepository(connection))
            }
        },
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