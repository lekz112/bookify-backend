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
        user: async (_parent, _args, { userService, userId }): Promise<User> => {                                           
            return userService.findById(userId)
        }
    },
    Mutation: {
        signUp: async (_parent, { input }, { userService }): Promise<SignUpPayload> => {            
            return userService.signUp(input.email, input.password);
        },

        signIn: async (_parent, { input }, { userService }): Promise<SignInPayload> => {
            return userService.signIn(input.email, input.password);
        }
    }
};