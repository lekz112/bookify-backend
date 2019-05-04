import { PoolClient } from "pg";
import { Meetup, MeetupStatus } from "./meetup";
import { MeetupRepository } from "./meetupRepository";

class MeetupEntity {
    id: string
    name: string
    status: string
    created_at: Date
}

export class PostgressMetupRepository implements MeetupRepository {

    constructor(private client: PoolClient) {
    }

    findAll(): Promise<Meetup[]> {
        return this.client
            .query('SELECT * from meetups WHERE status != $1', [MeetupStatus.Canceled])
            .then(result => result.rows as MeetupEntity[])
            .then(entities => entities.map(PostgressMetupRepository.mapToDomain));
    }

    findById(id: string): Promise<Meetup | undefined> {
        return this.client
            .query('SELECT * from meetups WHERE id = $1', [id])
            .then(result => result.rows[0] as MeetupEntity)
            .then(PostgressMetupRepository.mapToDomain);
    }

    async create(name: string): Promise<Meetup> {
        return this.client
            .query('INSERT INTO meetups(name, status) VALUES ($1,$2) RETURNING *', [name, MeetupStatus.Scheduled])
            .then(result => result.rows[0] as MeetupEntity)
            .then(PostgressMetupRepository.mapToDomain)
    }

    async setStatus(id: string, status: string): Promise<Meetup> {        
        return this.client
            .query('UPDATE meetups SET status = $1 WHERE id = $2 RETURNING *', [status, id])            
            .then(result => result.rows[0] as MeetupEntity)
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