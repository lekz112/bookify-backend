import { User } from "../types";

export interface UsersRepository {
    findById(id: string): Promise<User>    
    create(email: string): Promise<User>    
}