import { MeetupAttendanceRepository, MeetupAttendance } from "./meetupAttendanceRepository";
import { Connection } from "typeorm";

export class PostgressMeetupAttendanceRepository implements MeetupAttendanceRepository {

    private meetupAttendancesTable: string = "meetup_attendances";
    
    constructor(private connection: Connection) {
    }
    
    findByMeetupId(meetupId: string): Promise<MeetupAttendance[]> {
        return this.connection.createQueryBuilder()
            .select()
            .from(this.meetupAttendancesTable, 'meetup_attendances')
            .where('meetup_attendances.meetup_id = :meetup_id', { meetup_id: meetupId })            
            .getRawMany()  
    }

}