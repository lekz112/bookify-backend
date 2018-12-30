import { User } from "../types";

export interface UsersRepository {
    findByEmail(email: string): Promise<UserWithPassword>;
    findById(id: string): Promise<User>
    create(email: string, password: string): Promise<User>
}

export type UserWithPassword = User & { password: string }