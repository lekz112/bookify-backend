import { Connection } from "typeorm";
import { Meetup, MeetupRepository, MeetupStatus } from "./meetupRepository";
import { MeetupRole } from "./meetupAttendanceRepository";

export class PostgressMetupRepository implements MeetupRepository {

    private meetupsTable: string = "meetups"
    private meetupAttendancesTable: string = "meetup_attendances";

    constructor(private connection: Connection) {
    }

    findAll(): Promise<Meetup[]> {
        return this.connection.createQueryBuilder()
            .select()
            .from(this.meetupsTable, 'meetups')
            .where('meetups.status != :status', { status: MeetupStatus.Canceled })
            .getRawMany()
    }

    findById(id: string): Promise<Meetup> {
        return this.connection.createQueryBuilder()
            .select()
            .from(this.meetupsTable, 'meetups')
            .where('meetups.id = :id', { id })
            .getRawOne()
    }

    async create(ownerId: string, name: string): Promise<Meetup> {
        const result = await this.connection.createQueryBuilder()
                .insert()
                .into(this.meetupsTable)
                .values({ name, status: MeetupStatus.Scheduled })
                .returning('*')
                .execute();
            const meetup = result.raw[0] as Meetup;

        return result.raw[0];
    }

    async cancel(id: string): Promise<Meetup> {
        const result = await this.connection.createQueryBuilder()
            .update(this.meetupsTable)
            .set({ status: MeetupStatus.Canceled })
            .where('id = :id', { id })
            .returning('*')
            .execute()

        return result.raw[0];

    }

}