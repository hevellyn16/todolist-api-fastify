import bcrypt from 'bcrypt';
import { AuthRepository } from "../repositories/auth-repository";

const authRepository = new AuthRepository();

export class AuthService {
    async validateUser(email: string, password: string) {
        const user = await authRepository.findUserByEmail(email);

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return null;
        }

        return user;
    }
}