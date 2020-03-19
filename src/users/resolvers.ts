import { QueryResolvers, MutationResolvers, User, SignUpPayload, SignInPayload } from "../types";
import { Email, Name, Password } from "./types";

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
        user: (_parent, _args, { userService, userId }): Promise<User> => {
            if (!userId) {
                throw new Error("Not authorized");
            }                                           
            return userService.findById(userId)
        }
    },
    Mutation: {
        signUp: (_parent, { input }, { userService }): Promise<SignUpPayload> => {     
            const { email, name, password} = input;                   
            return userService.signUp(
                new Email(email, /* listOfExistingEmails */), 
                new Name(name), 
                new Password(password)
            );
        },

        signIn: (_parent, { input }, { userService }): Promise<SignInPayload> => {
            return userService.signIn(input.email, input.password);
        }
    }
};