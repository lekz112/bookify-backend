import { Connection } from "typeorm";
import { PostgressMetupRepository, PostgressMeetupAttendanceRepository } from "../src/meetup";
import { PostgressUsersRepository } from "../src/users/postgressUsersRepository";
import { company, internet } from 'faker'
import { Meetup } from "../src/types";

export const createMeetup = async (connection: Connection): Promise<Meetup> => {
    const userRepo = new PostgressUsersRepository(connection);
    const meetupRepo = new PostgressMetupRepository(connection);
    const meetupAttendanceRepo = new PostgressMeetupAttendanceRepository(connection);

    const owner = await userRepo.create(internet.email(), internet.password());
    const meetup = await meetupRepo.create(owner.id, company.companyName());
    const attendees = await meetupAttendanceRepo.findByMeetupId(meetup.id);
    const userAttendess = await Promise.all(attendees.map(async (attendee) => ({
        role: attendee.role,
        user: await userRepo.findById(attendee.user_id)
    })));

    return {
        ...meetup,
        attendees: userAttendess
    }
}