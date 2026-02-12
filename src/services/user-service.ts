import { UserRepository } from "../repositories/user-repository";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async createUser(name: string, email: string, password: string) {
        return await this.userRepository.createUser(name, email, password);
    }

    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }
}