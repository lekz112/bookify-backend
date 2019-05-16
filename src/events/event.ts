export class Event {
    id: string
    name: string    
    status: EventStatus    
    createdAt: Date  
}

export enum EventStatus {
    Scheduled = "SCHEDULED",
    Canceled = "CANCELED"
}