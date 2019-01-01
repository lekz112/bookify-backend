import { gql } from "apollo-server-koa";

export const CreateMeetupMutation = gql`
mutation CreateMeetup($name: String!) {
    createMeetup(input: {
        name: $name
    }) {
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