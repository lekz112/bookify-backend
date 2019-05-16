import { gql } from "apollo-server-koa";

export const cancelEventAttendanceMutation = gql`
mutation CancelEventAttendance($eventId: ID!) {
  cancelEventAttendance(eventId: $eventId) {
    role
    status
    user {
      id
    }
  }
}`;