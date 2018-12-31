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
    findAll(): Promise<Meetup[]>        
    create(ownerId: string, name: string): Promise<Meetup>
    delete(id: string): Promise<Meetup>
}