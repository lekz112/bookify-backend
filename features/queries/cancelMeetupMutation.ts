import { gql } from "apollo-server-koa";

export const CancelEventMutation = gql`
mutation CancelEvent($id: ID!) {
    cancelEvent(input: {
        id: $id
    }) {
        id
        status
    }    
}`;