import { MeetupRepository } from "./repository/meetupRepository";
import { StubMeetupRepository } from "./repository/stubMeetupRepository";

export const meetupRepository: MeetupRepository = new StubMeetupRepository();
export { meetupResolvers } from './resolvers'