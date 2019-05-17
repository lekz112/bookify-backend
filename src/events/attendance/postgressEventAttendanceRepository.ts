import { Connection } from "typeorm";
import { EventAttendanceRepository } from "./eventAttendanceRepository";
import { EventAttendance, EventAttendanceRole, EventAttendanceStatus } from "./eventAttendance";
import { PgClient } from "persistance/pgClient";

interface EventAttendanceEntity {
    id: string
    user_id: string
    event_id: string
    role: string
    canceled_at?: Date
}

export class PostgressEventAttendanceRepository implements EventAttendanceRepository {

    constructor(private client: PgClient) {
    }

    findByEventId(eventId: string): Promise<EventAttendance[]> {
        return this.client
            .query<EventAttendanceEntity>(
                'SELECT * FROM event_attendances WHERE event_id = :eventId',
                { eventId }
            )
            .then(e => e.map(PostgressEventAttendanceRepository.mapToDomain))
    }

    async create(userId: string, eventId: string, role: EventAttendanceRole): Promise<EventAttendance> {
        return this.client
            .queryOne<EventAttendanceEntity>(
                'INSERT INTO event_attendances(event_id, user_id, role) VALUES (:eventId, :userId, :role) RETURNING *',
                { eventId, userId, role }
            )
            .then(PostgressEventAttendanceRepository.mapToDomain);
    }

    async cancel(userId: string, eventId: string): Promise<EventAttendance> {
        return this.client
            .queryOneOrFail<EventAttendanceEntity>(
                'UPDATE event_attendances SET canceled_at = NOW() WHERE user_id = :userId AND event_id = :eventId RETURNING *',
                { userId, eventId }
            )
            .then(PostgressEventAttendanceRepository.mapToDomain);
    }

    private static mapToDomain(entity: EventAttendanceEntity): EventAttendance {
        const status = entity.canceled_at ? EventAttendanceStatus.Canceled : EventAttendanceStatus.Confirmed
        return {
            id: entity.id,
            status,
            userId: entity.user_id,
            eventId: entity.event_id,
            role: entity.role as EventAttendanceRole
        }
    }
}