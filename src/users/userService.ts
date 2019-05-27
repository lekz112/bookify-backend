import { User, SignUpPayload, SignInPayload } from "../types";
import { UsersRepository } from "./usersRepository";
import { signJWT } from './JWT'
import * as bcrypt from 'bcrypt';
import config from '../config'
import { QueryFailedError } from "typeorm";
import { Email, Name, Password } from "./types";

export class UserService {
    constructor(private userRepository: UsersRepository) { }

    findById(id: string): Promise<User> {
        return this.userRepository.findById(id);
    }

    async signIn(email: string, password: string): Promise<SignInPayload> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Email or password is not correct")
        }

        const isSame = await bcrypt.compare(password, user.password);
        if (!isSame) {
            throw new Error("Email or password is not correct")
        }

        return { user, token: signJWT(user.id) };
    }

    async signUp(email: Email, name: Name, password: Password): Promise<SignUpPayload> {
        const hashedPassword = await bcrypt.hash(password.value, config.bcryptSaltRounts);
        try {
            const user = await this.userRepository.create(email.value, name.value, hashedPassword);

            return { user, token: signJWT(user.id) };
        }
        catch (error) {
            // TODO: Make idenpotent
            if (error instanceof QueryFailedError && error.message.includes("duplicate key")) {
                throw new Error("Email is already used");
            }
            throw error;
        }
    }    
}