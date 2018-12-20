import { QueryResolvers, Meetup, MutationResolvers } from '../types'

interface MeetupResolvers {
    Query: {
        meetups: QueryResolvers.MeetupsResolver
    }
    Mutation: {
        createMeetup: MutationResolvers.CreateMeetupResolver
        cancelMeetup: MutationResolvers.CancelMeetupResolver
    }
}

export const meetupResolvers: MeetupResolvers = {
    Query: {
        meetups: async (_parent, _args, context): Promise<Meetup[]> => {
            const { meetupRepository } = context;
            return meetupRepository.findAll()
        }
    },
    Mutation: {
        createMeetup: async (_parent, { input }, { meetupRepository }): Promise<Meetup> => {
            return meetupRepository.create(input.name);
        },

        cancelMeetup: async (_parent, { input }, { meetupRepository }): Promise<Meetup> => {
            return meetupRepository.delete(input.id);
        }
    }
};