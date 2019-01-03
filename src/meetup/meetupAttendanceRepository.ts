// TODO: Right now we depend on this having the same name as DB column. Definitely not a good idea.
export type MeetupAttendance = {
    id: string,
    user_id: string,
    meetup_id: string,
    role: MeetupRole,
    canceled_at: Date
}

export enum MeetupRole {
    Owner = "OWNER",
    Guest = "GUEST"
}

export enum MeetupAttendanceStatus {
    Confirmed = "CONFIRMED",
    Canceled = "CANCELED"
}

export interface MeetupAttendanceRepository {
    findByMeetupId(meetupId: string): Promise<MeetupAttendance[]>    
    create(userId: string, meetupId: string, role: MeetupRole): Promise<MeetupAttendance>;
    cancel(userId: string, meetupId: string): Promise<MeetupAttendance>;    
}