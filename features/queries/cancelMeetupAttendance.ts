import { gql } from "apollo-server-koa";

export const cancelMeetupAttendanceMutation = gql`
mutation CancelMeetupAttendance($meetupId: String!) {
  cancelMeetupAttendance(meetupId: $meetupId) {
    role
    user {
      id
    }
  }
}`;