import { gql } from "apollo-server-koa";

export const signUpMutation = gql`
mutation SignUpMutation($email: String!, $name: String!, $password: String!) {
  signUp(input: { email: $email, name: $name, password: $password}) {
    token
    user {
      id
    }
  }
}`;