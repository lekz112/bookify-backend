import { Meetup, MutationResolvers, QueryResolvers, MeetupResolvers, MeetupAttendance, MeetupAttendanceResolvers, User } from '../types';

interface MeetupResolvers {
    Query: {
        meetups: QueryResolvers.MeetupsResolver
    }
    Mutation: {
        createMeetup: MutationResolvers.CreateMeetupResolver
        cancelMeetup: MutationResolvers.CancelMeetupResolver
    }
    Meetup: {
        attendees: MeetupResolvers.AttendeesResolver
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
        }
    },
    Mutation: {
        createMeetup: async (_parent, { input }, { meetupRepository, userId }): Promise<Meetup> => {
            const meetup = await meetupRepository.create(userId, input.name);
            return { ...meetup, attendees: [] };
        },

        cancelMeetup: async (_parent, { input }, { meetupRepository }): Promise<Meetup> => {
            const meetup = await meetupRepository.delete(input.id);
            return { ...meetup, attendees: [] };
        }
    },
    Meetup: {
        attendees: async ({ id }, _args, { meetupRepository, userService }): Promise<MeetupAttendance[]> => {
            const attendees = await meetupRepository.findAll2(id)
            return await Promise.all(attendees.map(async (attendee) => ({
                role: attendee.role,
                user: await userService.findById(attendee.user_id)
            })))
        }
    }
};