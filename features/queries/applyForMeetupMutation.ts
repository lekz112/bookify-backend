import { gql } from "apollo-server-koa";

export const applyForMeetupMutation = gql`
mutation ApplyForMeetup($meetupId: String!) {
  applyForMeetup(meetupId: $meetupId) {
    id
    role
    status
    user {
      id
    }
  }
}`;