import { Meetup } from "./meetup";

export interface MeetupRepository {
    findById(id: string): Promise<Meetup | undefined>;
    findAll(): Promise<Meetup[]>        
    create(name: string): Promise<Meetup>
    setStatus(id: string, status: string): Promise<Meetup>
}