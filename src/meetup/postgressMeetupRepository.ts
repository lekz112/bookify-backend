import { PgClient } from "../pgClient";
import { Meetup, MeetupStatus } from "./meetup";
import { MeetupRepository } from "./meetupRepository";

class MeetupEntity {
    id: string
    name: string
    status: string
    created_at: Date
}

export class PostgressMetupRepository implements MeetupRepository {

    constructor(private client: PgClient) {
    }

    findAll(): Promise<Meetup[]> {
        return this.client
            .query<MeetupEntity>(
                'SELECT * from meetups WHERE status != :status',
                { status: MeetupStatus.Canceled }
            )
            .then(entities => entities.map(PostgressMetupRepository.mapToDomain));
    }

    findById(id: string): Promise<Meetup | undefined> {
        return this.client
            .queryOne<MeetupEntity>(
                'SELECT * from meetups WHERE id = :id',
                { id }
            )
            .then(PostgressMetupRepository.mapToDomain);
    }

    async create(name: string): Promise<Meetup> {
        return this.client
            .queryOne<MeetupEntity>(
                'INSERT INTO meetups(name, status) VALUES (:name, :status) RETURNING *',
                { name, status: MeetupStatus.Scheduled }
            )
            .then(PostgressMetupRepository.mapToDomain)
    }

    async setStatus(id: string, status: string): Promise<Meetup> {
        return this.client
            .queryOne(
                'UPDATE meetups SET status = :status WHERE id = :id RETURNING *',
                { status, id }
            )
            .then(PostgressMetupRepository.mapToDomain)
    }

    private static mapToDomain(entity: MeetupEntity): Meetup {
        return {
            ...entity,
            status: entity.status as MeetupStatus,
            createdAt: entity.created_at
        }
    }
}
