import { gql } from "apollo-server-koa";

export const signInMutation = gql`
mutation SignInMutation($email: String!, $password: String!) {
  signIn(input: { email: $email, password: $password}) {
    token
    user {
      id
    }
  }
}`;