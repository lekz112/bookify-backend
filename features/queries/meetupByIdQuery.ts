import { gql } from "apollo-server-koa";

export const meetupByIdQuery = gql`
query MeetupById($id: String!) {
  meetup(id: $id) {
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