import { UserRepository } from "../repositories/user-repository";
import bcrypt from 'bcrypt';

const userRepository = new UserRepository();

export class UserService {
    async create(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await userRepository.create({ ...data, password: hashedPassword });
    }

    async getProfile(userId: string) {
        const user = await userRepository.findById(userId);
        if (!user) throw new Error("UserNotFound");
        return user;
    }

    async updateProfile(userId: string, data: any) {
        const user = await userRepository.findById(userId);
        if (!user) throw new Error("UserNotFound");
        const updateData = { ...data };
        
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        return await userRepository.update(userId, updateData);
    }
}