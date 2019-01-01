import { Connection } from "typeorm";
import { PostgressMetupRepository, PostgressMeetupAttendanceRepository } from "./meetup";
import { PostgressUsersRepository } from "./users/postgressUsersRepository";
import { UserService } from "./users";
import { BookifyContext } from "./index";
import { Context } from "koa";
import jsonwebtoken, { TokenExpiredError } from "jsonwebtoken";

const extractBearerToken = (header: string): string | undefined => {
    if (!header) return;

    const bearerMatch = /^Bearer (.*)$/;
    const matches = header.match(bearerMatch);

    if (matches && matches[1]) {
        return matches[1];
    }

    return;
};

export const createContextFunction = (connection: Connection) => {
    const meetupRepository = new PostgressMetupRepository(connection);
    const meetupAttendanceRepository = new PostgressMeetupAttendanceRepository(connection);
    const userService = new UserService(new PostgressUsersRepository(connection));

    return async ({ ctx }: { ctx: Context }): Promise<BookifyContext> => {
        const authorizationHeader = ctx.get('Authorization');
        const bearerToken = extractBearerToken(authorizationHeader);

        let userId: string
        if (bearerToken) {
            try {
                userId = (jsonwebtoken.verify(bearerToken, "secret") as any).id; // result.id
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    // TODO: add a proper type
                    throw new Error("Token expired");
                }
            }
        }
        console.log("result: " + userId);

        return {
            meetupRepository,
            meetupAttendanceRepository,
            userService,
            userId
        }
    };
}