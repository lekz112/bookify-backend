import { MeetupAttendanceResolvers, MeetupAttendanceStatus, MeetupResolvers, MutationResolvers, QueryResolvers } from '../types';
import { MeetupAttendance } from './meetupAttendanceRepository';

interface MeetupResolvers {
    Query: {
        meetups: QueryResolvers.MeetupsResolver
        meetup: QueryResolvers.MeetupResolver
    },
    Mutation: {
        createMeetup: MutationResolvers.CreateMeetupResolver
        cancelMeetup: MutationResolvers.CancelMeetupResolver
        applyForMeetup: MutationResolvers.ApplyForMeetupResolver
        cancelMeetupAttendance: MutationResolvers.CancelMeetupAttendanceResolver
    },
    Meetup: {
        attendees: MeetupResolvers.AttendeesResolver
    },
    MeetupAttendance: {
        user: MeetupAttendanceResolvers.UserResolver
        status: MeetupAttendanceResolvers.StatusResolver
    }
}

export const meetupResolvers: MeetupResolvers = {
    Query: {
        meetups: (_parent, _args, { meetupRepository }): Promise<any> => {            
            return meetupRepository.findAll();
        },
        meetup: (_parent, { id }, { meetupRepository }): Promise<any> => {
            return meetupRepository.findById(id);            
        }
    },
    Mutation: {
        createMeetup: (_parent, { input }, { meetupService, userId }): Promise<any> => {
            if (!userId) {
                throw new Error("Not authorized");
            }
            return meetupService.createMeetup(userId, input.name);            
        },
        cancelMeetup: (_parent, { input }, { meetupService, userId }): Promise<any> => {
            if (!userId) {
                throw new Error("Not authorized");
            }
            return meetupService.cancelMeetup(userId, input.id)
        },
        applyForMeetup: (_parent, { meetupId }, { userId, meetupService }): Promise<any> => {            
            if (!userId) {
                throw new Error("Not authorized");
            }
            return meetupService.applyForMeetup(userId, meetupId);            
        },
        cancelMeetupAttendance: (_parent, { meetupId }, { userId, meetupService }): Promise<any> => {
            if (!userId) {
                throw new Error("Not authorized");
            }
            return meetupService.cancelMeetupAttendance(userId, meetupId);            
        }
    },
    MeetupAttendance: {
        user: (_parent, _args, { userService}): Promise<any> => {
            // Problem: we know that our parent resolver returns domain type that contains additional info
            // According to types though, we cannot know it
            // Returning the actual graphql type is impossible, since we would need to eagerly resolve stuff
            // Or well, introduce some kind of "View" objects that contain lazy functions
            // Though that would require additional mapping, which I don't like
            // We can also decide not to use generated types here or use our own ones instead
            const meetupAttendance = <MeetupAttendance><unknown>_parent;
            return userService.findById(meetupAttendance.user_id);
        },
        status: (_parent, _args, _context): any => {
            const meetupAttendance = <MeetupAttendance><unknown>_parent;
            return meetupAttendance.canceled_at ? MeetupAttendanceStatus.Canceled : MeetupAttendanceStatus.Confirmed;
        }
    },
    Meetup: {
        attendees: ({ id }, _args, { meetupAttendanceRepository }): Promise<any> => {
            return meetupAttendanceRepository.findByMeetupId(id);
        }
    }
};