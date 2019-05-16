import { TransactionScope } from '../persistance/transactionScope';
import { EventAttendance, EventAttendanceRole } from "./attendance/eventAttendance";
import { EventAttendanceRepository } from "./attendance/eventAttendanceRepository";
import { Event, EventStatus } from './event';
import { EventRepository } from "./eventRepository";

export class EventService {

    constructor(
        private transactionScope: TransactionScope,
        private eventRepository: EventRepository,
        private eventAttendanceRepository: EventAttendanceRepository
    ) { }

    async createEvent(userId: string, name: string): Promise<Event> {
        try {
            await this.transactionScope.begin();
            const event = await this.eventRepository.create(name);
            const attendee = await this.eventAttendanceRepository.create(userId, event.id, EventAttendanceRole.Owner);            
            await this.transactionScope.commit();
            const result = { ...event, attendess: [attendee] }            
            // FIXME, should we pass attendees here?
            return result
        } catch (e) {
            await this.transactionScope.rollback()
            throw e
        }
    }

    async applyForEvent(userId: string, eventId: string): Promise<EventAttendance> {
        try {
            const attendance = await this.eventAttendanceRepository.create(userId, eventId, EventAttendanceRole.Guest);
            return attendance;
        } catch (error) {
            // 23505 - constraint violation TODO: map to domain error in repo instead
            if (error.code == 23505 && error.constraint == 'event_attendances_event_id_user_id_idx') {
                throw new Error("Already an attendee");
            }
            throw error;
        }
    }

    async cancelEvent(userId: string, id: string): Promise<Event> {
        const event = await this.eventRepository.findById(id);

        if (event === undefined) {
            throw new Error("Event doesn't exist")
        }
        // TODO: check owner
        if (event.status == EventStatus.Canceled) {
            return event
        }

        const result = await this.eventRepository.setStatus(id, EventStatus.Canceled);
        return result
    }


    async cancelEventAttendance(userId: string, eventId: string): Promise<EventAttendance> {
        return this.eventAttendanceRepository.cancel(userId, eventId);
    }
}