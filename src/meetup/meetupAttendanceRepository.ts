// TODO: Right now we depend on this having the same name as DB column. Definitely not a good idea.
export type MeetupAttendance = {
    user_id: string,
    meetup_id: string,
    role: MeetupRole
}

export enum MeetupRole {
    Owner = "OWNER",
    Guest = "GUEST"
}

export interface MeetupAttendanceRepository {
    findByMeetupId(meetupId: string): Promise<MeetupAttendance[]>
}