import { Connection } from "typeorm";
import { Meetup, MeetupRepository, MeetupStatus, MeetupRole, MeetupAttendance } from "./meetupRepository";

export class PostgressMetupRepository implements MeetupRepository {

    private meetupAttendancesTable: string = "meetup_attendances";
    private meetupsTable: string = "meetups"

    constructor(private connection: Connection) {
    }

    findAll(): Promise<Meetup[]> {
        return this.connection.createQueryBuilder()
            .select()
            .from(this.meetupsTable, 'meetups')
            .where('meetups.status != :status', { status: MeetupStatus.Canceled })            
            .getRawMany()
    }

    // TODO: move to a separate repository
    findAll2(meetupId: string): Promise<MeetupAttendance[]> {
        return this.connection.createQueryBuilder()
            .select()
            .from(this.meetupAttendancesTable, 'meetup_attendances')
            .where('meetup_attendances.meetup_id = :meetup_id', { meetup_id: meetupId })            
            .getRawMany()            
    }

    async create(ownerId: string, name: string): Promise<Meetup> {
        return await this.connection.transaction(async (entityManager) => {
            const result = await entityManager.createQueryBuilder()
                .insert()
                .into(this.meetupsTable)
                .values({ name, status: MeetupStatus.Scheduled })
                .returning('*')
                .execute();
            const meetup = result.raw[0] as Meetup;

            const attendanceResult = await entityManager.createQueryBuilder()
                .insert()
                .into(this.meetupAttendancesTable)
                .values({ user_id: ownerId, meetup_id: meetup.id, role: MeetupRole.Owner })
                .returning('*')
                .execute();
            const meetupAttendance = attendanceResult.raw[0];

            return meetup
        });
    }

    async delete(id: string): Promise<Meetup> {
        const result = await this.connection.createQueryBuilder()
            .update(this.meetupsTable)
            .set({ status: MeetupStatus.Canceled })
            .where('id = :id', { id })
            .returning('*')
            .execute()

        return result.raw[0];

    }

}