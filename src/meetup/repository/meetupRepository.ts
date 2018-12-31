export type Meetup = {
    id: string,
    name: string
    status: MeetupStatus
    created_at: Date    
}

// TODO: Right now we depend on this having the same name as DB column. Definitely not a good idea.
export type MeetupAttendance = {
    user_id: string,
    meetup_id: string,
    role: MeetupRole
}

export enum MeetupStatus {
    Scheduled = "SCHEDULED",
    Canceled = "CANCELED"
}

export enum MeetupRole {
    Owner = "OWNER",
    Guest = "GUEST"
}

export interface MeetupRepository {
    findAll(): Promise<Meetup[]>    
    findAll2(meetupId: string): Promise<MeetupAttendance[]>
    create(ownerId: string, name: string): Promise<Meetup>
    delete(id: string): Promise<Meetup>
}