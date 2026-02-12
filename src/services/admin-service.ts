import bcrypt from 'bcrypt';
import { AdminRepository } from "../repositories/admin-repository";

const adminRepository = new AdminRepository();

export class AdminService {
    async updateUser(id: string, data: any) {
        const updateData = { ...data };
        
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        return await adminRepository.updateAnyUser(id, updateData);
    }

    async listAllUsers() {
        return await adminRepository.findAllUsers(false);
    }

    async softDeleteUser(id: string) {
        return await adminRepository.updateAnyUser(id, { isDeleted: true });
    }

    async listAllTasks() {
        return await adminRepository.findAllTasksInSystem();
    }

    async updateTaskStatus(id: string, data: any) {
        const task = await adminRepository.findTaskById(id);
        
        if (!task) {
            throw new Error("TaskNotFound");
        }

        return await adminRepository.updateAnyUser(id, data); 
    }
}