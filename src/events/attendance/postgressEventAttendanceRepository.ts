import { Connection } from "typeorm";
import { EventAttendanceRepository } from "./eventAttendanceRepository";
import { EventAttendance, EventAttendanceRole, EventAttendanceStatus } from "./eventAttendance";

interface EventAttendanceEntity {
    id: string
    user_id: string
    event_id: string
    role: string
    canceled_at?: Date
}

export class PostgressEventAttendanceRepository implements EventAttendanceRepository {

    private eventAttendancesTable: string = "event_attendances";

    constructor(private connection: Connection) {
    }

    findByEventId(eventId: string): Promise<EventAttendance[]> {
        return this.connection.createQueryBuilder()
            .select()
            .from(this.eventAttendancesTable, 'event_attendances')
            .where('event_attendances.event_id = :eventId', { eventId })
            .getRawMany()
            .then(e => e.map(PostgressEventAttendanceRepository.mapToDomain))
    }

    async create(userId: string, eventId: string, role: EventAttendanceRole): Promise<EventAttendance> {
        const result = await this.connection.createQueryBuilder()
            .insert()
            .into(this.eventAttendancesTable)
            .values({ user_id: userId, event_id: eventId, role: role })
            .returning('*')
            .execute();

        return PostgressEventAttendanceRepository.mapToDomain(result.raw[0]);
    }

    async cancel(userId: string, eventId: string): Promise<EventAttendance> {
        const result = await this.connection.createQueryBuilder()
            .update(this.eventAttendancesTable)
            .set({ canceled_at: 'NOW()' })
            .where('user_id = :userId AND event_id = :eventId', { userId, eventId })
            .returning('*')
            .execute();

        return PostgressEventAttendanceRepository.mapToDomain(result.raw[0]);        
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