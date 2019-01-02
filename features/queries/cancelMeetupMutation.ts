import { gql } from "apollo-server-koa";

export const CancelMeetupMutation = gql`
mutation CancelMeetup($id: String!) {
    cancelMeetup(input: {
        id: $id
    }) {
        id
        status
    }    
}`;