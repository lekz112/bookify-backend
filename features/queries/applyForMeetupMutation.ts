import { gql } from "apollo-server-koa";

export const applyForEventMutation = gql`
mutation ApplyForEvent($eventId: ID!) {
  applyForEvent(eventId: $eventId) {
    id
    role
    status
    user {
      id
    }
  }
}`;