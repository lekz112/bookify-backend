import jsonwebtoken, { TokenExpiredError } from "jsonwebtoken";
import { Context } from "koa";
import { Pool } from "pg";
import { Connection } from "typeorm";
import { PostgressEventAttendanceRepository as PostgressEventAttendanceRepository, PostgressMetupRepository as PostgressEventRepository } from "./events";
import { EventService } from "./events/eventService";
import { PgClient } from "./persistance/pgClient";
import { UserService } from "./users";
import { PostgressUsersRepository } from "./users/postgressUsersRepository";
import { EventRepository } from "events/eventRepository";
import { EventAttendanceRepository } from "events/attendance/eventAttendanceRepository";

export type BookifyContext = {
    eventRepository: EventRepository
    eventAttendanceRepository: EventAttendanceRepository
    userService: UserService
    eventService: EventService
    userId: string | undefined
}


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
        
        let userId: string | undefined
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
        const eventRepository = new PostgressEventRepository(pgClient);
        const eventAttendanceRepository = new PostgressEventAttendanceRepository(pgClient);
        const userService = new UserService(new PostgressUsersRepository(connection));
        const eventService = new EventService(pgClient, eventRepository, eventAttendanceRepository);

        // Release the client
        ctx.res.on("finish", () => client.release());

        return {
            eventRepository,
            eventAttendanceRepository,
            userService,
            eventService,
            userId
        }
    };
}