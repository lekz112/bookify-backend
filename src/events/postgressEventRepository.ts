import { PgClient } from "../pgClient";
import { Event, EventStatus } from "./event";
import { EventRepository } from "./eventRepository";

class EventEntity {
    id: string
    name: string
    status: string
    created_at: Date
}

export class PostgressEventRepository implements EventRepository {

    constructor(private client: PgClient) {
    }

    findAll(): Promise<Event[]> {
        return this.client
            .query<EventEntity>(
                'SELECT * from events WHERE status != :status',
                { status: EventStatus.Canceled }
            )
            .then(entities => entities.map(PostgressEventRepository.mapToDomain));
    }

    findById(id: string): Promise<Event | undefined> {
        return this.client
            .queryOne<EventEntity>(
                'SELECT * from events WHERE id = :id',
                { id }
            )
            .then(PostgressEventRepository.mapToDomain);
    }

    async create(name: string): Promise<Event> {
        return this.client
            .queryOne<EventEntity>(
                'INSERT INTO events(name, status) VALUES (:name, :status) RETURNING *',
                { name, status: EventStatus.Scheduled }
            )
            .then(PostgressEventRepository.mapToDomain)
    }

    async setStatus(id: string, status: EventStatus): Promise<Event> {
        return this.client
            .queryOne<EventEntity>(
                'UPDATE events SET status = :status WHERE id = :id RETURNING *',
                { status, id }
            )
            .then(PostgressEventRepository.mapToDomain)
    }

    private static mapToDomain(entity: EventEntity): Event {
        return {
            ...entity,
            status: entity.status as EventStatus,
            createdAt: entity.created_at
        }
    }
}
