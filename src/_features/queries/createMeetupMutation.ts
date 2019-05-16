import { gql } from "apollo-server-koa";

export const createEventMutation = gql`
mutation CreateEvent($name: String!) {
    createEvent(input: {
        name: $name
    }) {
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