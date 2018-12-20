import { create } from "domain";

export interface Meetup {
    id: string,
    name: string
    status: MeetupStatus
}

export enum MeetupStatus {
    Scheduled = "SCHEDULED",
    Canceled = "CANCELED"
}

export interface MeetupRepository {
    findAll(): Promise<Meetup[]>    
    create(name: string): Promise<Meetup>
    delete(id: string): Promise<Meetup>
}