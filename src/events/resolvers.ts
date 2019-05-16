import { EventAttendanceResolvers, EventResolvers, MutationResolvers, QueryResolvers } from "types";

interface EventResolvers {
    Query: {
        events: QueryResolvers.EventsResolver
        event: QueryResolvers.EventResolver
    },
    Mutation: {
        createEvent: MutationResolvers.CreateEventResolver
        cancelEvent: MutationResolvers.CancelEventResolver
        applyForEvent: MutationResolvers.ApplyForEventResolver
        cancelEventAttendance: MutationResolvers.CancelEventAttendanceResolver
    },
    Event: {
        attendees: EventResolvers.AttendeesResolver
    },
    EventAttendance: {
        user: EventAttendanceResolvers.UserResolver        
    }
}

export const eventResolvers: EventResolvers = {
    Query: {
        events: (_parent, _args, { eventRepository }): Promise<any> => {            
            return eventRepository.findAll();
        },
        event: (_parent, { id }, { eventRepository }): Promise<any> => {
            return eventRepository.findById(id);            
        }
    },
    Mutation: {
        createEvent: (_parent, { input }, { eventService, userId }): Promise<any> => {
            if (!userId) {
                throw new Error("Not authorized");
            }
            return eventService.createEvent(userId, input.name);            
        },
        cancelEvent: (_parent, { input }, { eventService, userId }): Promise<any> => {
            if (!userId) {
                throw new Error("Not authorized");
            }
            return eventService.cancelEvent(userId, input.id)
        },
        applyForEvent: (_parent, { eventId }, { userId, eventService }): Promise<any> => {            
            if (!userId) {
                throw new Error("Not authorized");
            }
            return eventService.applyForEvent(userId, eventId);            
        },
        cancelEventAttendance: (_parent, { eventId }, { userId, eventService }): Promise<any> => {
            if (!userId) {
                throw new Error("Not authorized");
            }
            return eventService.cancelEventAttendance(userId, eventId);            
        }
    },
    EventAttendance: {
        user: (_parent, _args, { userService}): Promise<any> => {
            // Problem: we know that our parent resolver returns domain type that contains additional info
            // According to types though, we cannot know it
            // Returning the actual graphql type is impossible, since we would need to eagerly resolve stuff
            // Or well, introduce some kind of "View" objects that contain lazy functions
            // Though that would require additional mapping, which I don't like
            // We can also decide not to use generated types here or use our own ones instead
            const eventAttendance = <any>_parent;
            return userService.findById(eventAttendance.userId);
        }
    },
    Event: {
        attendees: ({ id }, _args, { eventAttendanceRepository }): Promise<any> => {
            return eventAttendanceRepository.findByEventId(id);
        }
    }
};