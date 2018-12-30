import { Connection } from "typeorm";
import { User } from "../types"
import { UsersRepository, UserWithPassword } from "./usersRepository";

export class PostgressUsersRepository implements UsersRepository {
    
    constructor(private connection: Connection, private tableName: string = "users") {
    }

    async findByEmail(email: string): Promise<UserWithPassword> {
        return this.connection.createQueryBuilder()
            .select()
            .from(this.tableName, 'users')
            .where('users.email = :email', { email }) // And not deleted?
            .getRawOne()
    }
    

    async findById(id: String): Promise<User> {
        return this.connection.createQueryBuilder()
            .select()
            .from(this.tableName, 'users')
            .where('users.id = :id', { id })
            .getRawOne()
    }

    async create(email: string, password: string): Promise<User> {
        const result = await this.connection.createQueryBuilder()
            .insert()
            .into(this.tableName)
            .values({ email, password })
            .returning('*')
            .execute();

        return result.raw[0];
    }
}