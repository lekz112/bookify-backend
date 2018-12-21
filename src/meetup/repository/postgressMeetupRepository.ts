import { Connection } from "typeorm";
import { Meetup, MeetupRepository, MeetupStatus } from "./meetupRepository";

export class PostgressMetupRepository implements MeetupRepository {

    constructor(private connection: Connection, private tableName: string = "meetups") {
    }

    findAll(): Promise<Meetup[]> {
        return this.connection.createQueryBuilder()
            .select()
            .from(this.tableName, 'meetups')
            .where('meetups.status != :status', { status: MeetupStatus.Canceled })
            .getRawMany()
    }

    async create(name: string): Promise<Meetup> {
        const result = await this.connection.createQueryBuilder()
            .insert()
            .into(this.tableName)
            .values({ name, status: MeetupStatus.Scheduled })
            .returning('*')
            .execute();

        return result.raw[0];
    }

    async delete(id: string): Promise<Meetup> {
        const result = await this.connection.createQueryBuilder()
            .update(this.tableName)
            .set({ status: MeetupStatus.Canceled })
            .where('id = :id', { id })
            .returning('*')
            .execute()

        return result.raw[0];

    }

}