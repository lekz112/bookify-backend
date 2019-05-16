import { gql } from "apollo-server-koa";

export const eventByIdQuery = gql`
query EventById($id: ID!) {
  event(id: $id) {
    id
    name
    status
    createdAt
    attendees {
      role
      status
      user {
        id
        email
      }
    }
	}
}`;