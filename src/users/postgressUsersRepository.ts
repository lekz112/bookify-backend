import { Connection } from "typeorm";
import { User } from "../types"
import { UsersRepository } from "./usersRepository";

export class PostgressUsersRepository implements UsersRepository {
    
    constructor(private connection: Connection, private tableName: string = "users") {
    }

    async findById(id: String): Promise<User> {
        return this.connection.createQueryBuilder()
            .select()
            .from(this.tableName, 'users')
            .where('users.id == :id', { id })
            .getRawOne()
    }

    async create(email: string): Promise<User> {
        const result = await this.connection.createQueryBuilder()
            .insert()
            .into(this.tableName)
            .values({ email })
            .returning('*')
            .execute();

        return result.raw[0];
    }
}