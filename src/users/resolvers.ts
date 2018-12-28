import { QueryResolvers, MutationResolvers, User, SignUpPayload, SignInPayload } from "../types";

interface UserResolvers {
    Query: {
        user: QueryResolvers.UserResolver
    }
    Mutation: {
        signUp: MutationResolvers.SignUpResolver,
        signIn: MutationResolvers.SignInResolver        
    }
};

export const userResolvers: UserResolvers = {
    Query: {
        user: async (_parent, _args, context): Promise<User> => {            
            throw new Error("Not implemented");
        }
    },
    Mutation: {
        signUp: async (_parent, { input }, context): Promise<SignUpPayload> => {
            console.log(input.email);
            throw new Error("Not implemented");
        },

        signIn: async (_parent, { input }, context): Promise<SignInPayload> => {
            console.log(input.email);
            throw new Error("Not implemented");
        }
    }
};