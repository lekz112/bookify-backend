import { makeExecutableSchema, addSchemaLevelResolveFunction } from "graphql-tools";
import { importSchema } from "graphql-import";
import { eventResolvers } from "./events";
import { userResolvers } from "./users";
import { ApolloServer } from "apollo-server-koa";
import { BookifyContext } from "createContextFunction";

const typeDefs = importSchema('schema.graphql');
const schema = makeExecutableSchema({ typeDefs, resolvers: [eventResolvers, userResolvers] as any });
addSchemaLevelResolveFunction(schema, (source, args, context, info) => {
    // Unless user signs in/up, check that he is authorized (we know his userId)
    if (!['signIn', 'signUp'].includes(info.fieldName) && !context.userId) {
        throw new Error("Unauthorized");
    }
})

type BookifyContextFunction = (ctx: any) => Promise<BookifyContext>;

export const createApolloServer = (context: BookifyContextFunction) => {
    return new ApolloServer({
        schema,
        context,
        introspection: true,
        playground: true,
        formatError: (error: any) => {
            console.log(error);
            return error;
        },
    });
}