import { Meetup, MeetupStatus, MeetupRepository } from "./meetupRepository";
import { default as uuid } from 'uuid';

export class StubMeetupRepository implements MeetupRepository {

    public meetupList: Meetup[] = [];

    async findAll(): Promise<Meetup[]> {
        return this.meetupList
    }
    
    async create(name: string): Promise<Meetup> {
        const meetup = { id: uuid.v4(), name: name, status: MeetupStatus.Scheduled };
        this.meetupList.push(meetup)
        return meetup
    }

    async delete(id: string): Promise<Meetup> {
        const meetup = this.meetupList.find((m) => m.id == id);
        if (!meetup) {
            throw new Error("Couldn't find meetup with id: " + id)
        }        
        meetup.status = MeetupStatus.Canceled
        return meetup
    }


}