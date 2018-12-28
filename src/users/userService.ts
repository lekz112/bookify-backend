import { User, SignUpPayload } from "../types";
import { UsersRepository } from "./usersRepository";

export class UserService {
    constructor(private userRepository: UsersRepository) {}
    
    findById(id: string): Promise<User> {
        return this.userRepository.findById(id);
    }

    async signUp(email: string, password: string): Promise<SignUpPayload> {
        const user = await this.userRepository.create(email);
        return {
            user,
            token: "tbd"
        };
    }
}