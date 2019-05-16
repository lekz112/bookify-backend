import { gql } from "apollo-server-koa";

export const eventsQuery = gql`
query {
  events {
    id
    name
    status
    createdAt
    attendees {
      role
      user {
        id
        email
      }
    }
	}
}`;