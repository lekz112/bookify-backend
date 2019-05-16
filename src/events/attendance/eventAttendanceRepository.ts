import { EventAttendance, EventAttendanceRole } from "./eventAttendance";


export interface EventAttendanceRepository {
    findByEventId(eventId: string): Promise<EventAttendance[]>    
    create(userId: string, eventId: string, role: EventAttendanceRole): Promise<EventAttendance>;
    cancel(userId: string, eventId: string): Promise<EventAttendance>;    
}