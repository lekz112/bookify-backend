import { MeetupRepository, Meetup } from "./repository/meetupRepository";

export class MeetupService {

    constructor(private meetupRepository: MeetupRepository) {}

    async createMeetup(userId: string, name: string): Promise<Meetup> {
        // this.meetupRepository.create()
        return null;
    }
}