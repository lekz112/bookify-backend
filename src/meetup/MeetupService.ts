import { MeetupRepository, Meetup } from "./meetupRepository";
import { MeetupAttendanceRepository, MeetupAttendance, MeetupRole } from "./meetupAttendanceRepository";
import { QueryFailedError } from "typeorm";

export class MeetupService {

    constructor(private meetupRepository: MeetupRepository, private meetupAttendanceRepository: MeetupAttendanceRepository) { }

    async createMeetup(userId: string, name: string): Promise<Meetup> {
        // this.meetupRepository.create()
        return null;
    }

    async applyForMeetup(userId: string, meetupId: string): Promise<MeetupAttendance> {
        try {
            const attendance = await this.meetupAttendanceRepository.create(userId, meetupId, MeetupRole.Guest);
            return attendance;
        } catch (error) {
            if (error instanceof QueryFailedError && error.message.includes("duplicate key")) {
                throw new Error("Already an attendee");
            }
            throw error;
        }
    }
}