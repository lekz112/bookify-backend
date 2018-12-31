import { MeetupRepository, Meetup } from "./meetupRepository";

export class MeetupService {

    constructor(private meetupRepository: MeetupRepository) {}

    async createMeetup(userId: string, name: string): Promise<Meetup> {
        // this.meetupRepository.create()
        return null;
    }
}