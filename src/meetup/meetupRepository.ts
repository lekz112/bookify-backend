export type Meetup = {
    id: string,
    name: string
    status: MeetupStatus
    created_at: Date    
}

export enum MeetupStatus {
    Scheduled = "SCHEDULED",
    Canceled = "CANCELED"
}

export interface MeetupRepository {
    findById(id: string): Promise<Meetup>;
    findAll(): Promise<Meetup[]>        
    create(ownerId: string, name: string): Promise<Meetup>
    cancel(id: string): Promise<Meetup>
}