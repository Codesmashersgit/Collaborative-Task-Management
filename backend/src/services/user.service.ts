import { UserRepository } from '../repositories/user.repository.js';

export class UserService {
    constructor(private userRepository: UserRepository) { }

    async getUserProfile(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getAllUsers() {
        return this.userRepository.findAll();
    }

    async updateUserProfile(id: string, data: { name?: string }) {
        return this.userRepository.update(id, data);
    }
}
