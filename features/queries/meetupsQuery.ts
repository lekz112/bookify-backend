import { gql } from "apollo-server-koa";

export const MeetupsQuery = gql`
query {
  meetups {
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