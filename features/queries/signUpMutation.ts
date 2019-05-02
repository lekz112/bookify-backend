import { gql } from "apollo-server-koa";

export const signUpMutation = gql`
mutation SignUpMutation($email: String!, $password: String!) {
  signUp(input: { email: $email, password: $password}) {
    token
    user {
      id
    }
  }
}`;