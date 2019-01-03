import { Connection } from "typeorm";
import { MeetupAttendance, MeetupAttendanceRepository, MeetupRole } from "./meetupAttendanceRepository";

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

    async create(userId: string, meetupId: string, role: MeetupRole): Promise<MeetupAttendance> {
        const result = await this.connection.createQueryBuilder()
            .insert()
            .into(this.meetupAttendancesTable)
            .values({ user_id: userId, meetup_id: meetupId, role: role })
            .returning('*')
            .execute();

        return result.raw[0] as MeetupAttendance;
    }

    async cancel(userId: string, meetupId: string): Promise<MeetupAttendance> {
        const result = await this.connection.createQueryBuilder()
            .update(this.meetupAttendancesTable)
            .set({ canceled_at: 'NOW()' })
            .where('user_id = :userId AND meetup_id = :meetupId', { userId, meetupId })
            .returning('*')
            .execute();

        return result.raw[0] as MeetupAttendance;
    }

}