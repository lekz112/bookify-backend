import { gql } from "apollo-server-koa";

export const MeetupsQuery = gql`
query {
  meetups {
    id
    name
    status
    created_at
    attendees {
      role
      user {
        id
        email
      }
    }
	}
}`;