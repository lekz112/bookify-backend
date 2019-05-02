import { MeetupRepository } from "./meetupRepository";
import { MeetupAttendanceRepository, MeetupAttendance, MeetupRole } from "./meetupAttendanceRepository";
import { QueryFailedError } from "typeorm";
import { Meetup, MeetupStatus } from "./meetup";

export class MeetupService {
        
    constructor(private meetupRepository: MeetupRepository, private meetupAttendanceRepository: MeetupAttendanceRepository) { }

    async createMeetup(userId: string, name: string): Promise<Meetup> {        
        // TODO: wrap into transaction
        let meetup = await this.meetupRepository.create(name);
        let attendee = await this.meetupAttendanceRepository.create(userId, meetup.id, MeetupRole.Owner);                
        let result = { ...meetup,  attendess: [attendee] }                
        return result
    }

    async applyForMeetup(userId: string, meetupId: string): Promise<MeetupAttendance> {
        try {
            const attendance = await this.meetupAttendanceRepository.create(userId, meetupId, MeetupRole.Guest);
            return attendance;
        } catch (error) {
            // TODO: find a better approach?
            if (error instanceof QueryFailedError && error.message.includes("duplicate key")) {
                throw new Error("Already an attendee");
            }
            throw error;
        }
    }

    async cancelMeetup(userId: string, id: string): Promise<Meetup> {
        const meetup = await this.meetupRepository.findById(id);
        
        if (meetup === undefined) {
            throw new Error("Meetup doesn't exist")
        }
        // TODO: check owner
        if (meetup.status == MeetupStatus.Canceled) {
            return meetup
        }        

        const result = await this.meetupRepository.setStatus(id, MeetupStatus.Canceled);        
        return result
    }
    

    async cancelMeetupAttendance(userId: string, meetupId: string): Promise<MeetupAttendance> {
        return this.meetupAttendanceRepository.cancel(userId, meetupId);
    }
}