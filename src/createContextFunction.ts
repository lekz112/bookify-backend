import jsonwebtoken, { TokenExpiredError } from "jsonwebtoken";
import { Context } from "koa";
import { Pool } from "pg";
import { Connection } from "typeorm";
import { BookifyContext } from "./index";
import { PostgressMeetupAttendanceRepository, PostgressMetupRepository } from "./meetup";
import { MeetupService } from "./meetup/meetupService";
import { PgClient } from "./pgClient";
import { UserService } from "./users";
import { PostgressUsersRepository } from "./users/postgressUsersRepository";

const extractBearerToken = (header: string): string | undefined => {
    if (!header) return;

    const bearerMatch = /^Bearer (.*)$/;
    const matches = header.match(bearerMatch);

    if (matches && matches[1]) {
        return matches[1];
    }

    return;
};

export const createContextFunction = (connection: Connection, pool: Pool) => {    
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
        
        const client = await pool.connect();
        const pgClient = new PgClient(client);
        const meetupRepository = new PostgressMetupRepository(pgClient);
        const meetupAttendanceRepository = new PostgressMeetupAttendanceRepository(connection);
        const userService = new UserService(new PostgressUsersRepository(connection));
        const meetupService = new MeetupService(meetupRepository, meetupAttendanceRepository);

        // Release the client
        ctx.res.on("finish", () => client.release());

        return {
            meetupRepository,
            meetupAttendanceRepository,
            userService,
            meetupService,
            userId
        }
    };
}