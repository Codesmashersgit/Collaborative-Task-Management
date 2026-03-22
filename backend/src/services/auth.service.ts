import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';
import { CreateUserDto, LoginDto } from '../dto/user.dto.js';

export class AuthService {
    constructor(private userRepository: UserRepository) { }

    async register(input: any) {
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = await this.userRepository.create({
            ...input,
            password: hashedPassword,
        });

        const token = this.generateToken(user.id, user.email, user.role);
        return { user, token };
    }

    async login(input: any) {
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user.id, user.email, user.role);
        return { user, token };
    }

    private generateToken(id: string, email: string, role: string) {
        return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
        });
    }
}
