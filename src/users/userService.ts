import { User, SignUpPayload, SignInPayload } from "../types";
import { UsersRepository, UserWithPassword } from "./usersRepository";
import jsonwebtoken from "jsonwebtoken";

export class UserService {
    constructor(private userRepository: UsersRepository) { }

    findById(id: string): Promise<User> {
        return this.userRepository.findById(id);
    }

    async signIn(email: string, password: string): Promise<SignInPayload> {
        let user: UserWithPassword;
        try {
            user = await this.userRepository.findByEmail(email);
        } catch (error) {
            throw new Error("Email or password is not correct")
        }
        // FIXME: compare salted hashes
        if (!user || user.password != password) {
            throw new Error("Email or password is not correct")
        }
        return {
            user,
            token: this.signJWT(user.id)
        }
    }

    async signUp(email: string, password: string): Promise<SignUpPayload> {
        // FIXME: obviously, we don't want to store plain-text passwords
        const user = await this.userRepository.create(email, password);        
        return {
            user,
            token: this.signJWT(user.id)
        };
    }

    private signJWT(id: string): string {
        return jsonwebtoken.sign(
            { id },
            "secret",
            { expiresIn: "7d" }
        );
    }
}