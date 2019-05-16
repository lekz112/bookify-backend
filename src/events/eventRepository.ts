import { Event } from "./event";

export interface EventRepository {
    findById(id: string): Promise<Event | undefined>;
    findAll(): Promise<Event[]>        
    create(name: string): Promise<Event>
    setStatus(id: string, status: string): Promise<Event>
}