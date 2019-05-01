import { gql } from "apollo-server-koa";

export const meetupByIdQuery = gql`
query MeetupById($id: String!) {
  meetup(id: $id) {
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