import {
    Meetup, MutationResolvers, QueryResolvers, MeetupResolvers,
    MeetupAttendance as MeetupAttendanceAPI,
    MeetupAttendanceResolvers, User
} from '../types';
import { MeetupRole, MeetupAttendance } from './meetupAttendanceRepository';
import { UserService } from '../users';

interface MeetupResolvers {
    Query: {
        meetups: QueryResolvers.MeetupsResolver
        meetup: QueryResolvers.MeetupResolver
    }
    Mutation: {
        createMeetup: MutationResolvers.CreateMeetupResolver
        cancelMeetup: MutationResolvers.CancelMeetupResolver
        applyForMeetup: MutationResolvers.ApplyForMeetupResolver
    }
    Meetup: {
        attendees: MeetupResolvers.AttendeesResolver
    }
}

const convertMeetupAttendance = async (meetupAttendance: MeetupAttendance, userService: UserService): Promise<MeetupAttendanceAPI> => {
    return {
        role: meetupAttendance.role,
        user: await userService.findById(meetupAttendance.user_id)
    }
}

export const meetupResolvers: MeetupResolvers = {
    Query: {
        meetups: async (_parent, _args, context): Promise<Meetup[]> => {
            const { meetupRepository, userService } = context;
            const meetups = await meetupRepository.findAll();
            
            return meetups.map((meetup) => ({
                ...meetup,
                attendees: []
            }))
        },
        meetup: async (_parent, { id }, { meetupRepository }): Promise<Meetup> => {
            const meetup = await meetupRepository.findById(id);

            return {
                ...meetup,
                attendees: undefined
            }
        }
    },
    Mutation: {
        createMeetup: async (_parent, { input }, { meetupRepository, userId }): Promise<Meetup> => {
            const meetup = await meetupRepository.create(userId, input.name);
            return { ...meetup, attendees: [] };
        },
        cancelMeetup: async (_parent, { input }, { meetupRepository }): Promise<Meetup> => {
            const meetup = await meetupRepository.cancel(input.id);
            return { ...meetup, attendees: [] };
        },
        applyForMeetup: async (_parent, { meetupId }, { userId, meetupService, userService }): Promise<MeetupAttendanceAPI> => {
            // TODO: resolvers shouldn't decide what the default role is
            const meetupAttendance = await meetupService.applyForMeetup(userId, meetupId);
            return convertMeetupAttendance(meetupAttendance, userService)
        }
    },
    Meetup: {
        attendees: async ({ id }, _args, { meetupAttendanceRepository, userService }): Promise<MeetupAttendanceAPI[]> => {
            const attendees = await meetupAttendanceRepository.findByMeetupId(id)

            return await Promise.all(attendees.map(async (attendee) => convertMeetupAttendance(attendee, userService)));
        }
    }
};