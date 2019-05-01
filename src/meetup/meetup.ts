export class Meetup {
    id: string
    name: string    
    status: MeetupStatus    
    createdAt: Date  
}

export enum MeetupStatus {
    Scheduled = "SCHEDULED",
    Canceled = "CANCELED"
}