import { gql } from "apollo-server-koa";

export const CreateMeetupMutation = gql`
mutation CreateMeetup($name: String!) {
    createMeetup(input: {
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