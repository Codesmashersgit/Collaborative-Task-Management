import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { CreateUserDto, LoginDto } from '../dto/user.dto.js';

export class AuthController {
    constructor(private authService: AuthService) { }

    register = async (req: Request, res: Response) => {
        const input = CreateUserDto.parse(req.body);
        const { user, token } = await this.authService.register(input);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({ success: true, data: user, token });
    };

    login = async (req: Request, res: Response) => {
        const input = LoginDto.parse(req.body);
        const { user, token } = await this.authService.login(input);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ success: true, data: user, token });
    };

    logout = async (req: Request, res: Response) => {
        res.clearCookie('token');
        res.json({ success: true, message: 'Logged out successfully' });
    };

    me = async (req: Request, res: Response) => {
        try {
            const user = await this.authService.getProfile(req.user!.id);
            res.json({ success: true, data: user });
        } catch (error) {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    };

}
