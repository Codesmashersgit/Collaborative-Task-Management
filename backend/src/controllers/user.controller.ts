import type { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';

export class UserController {
    constructor(private userService: UserService) { }

    getProfile = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const user = await this.userService.getUserProfile(userId);
        res.json({ success: true, data: user });
    };

    getAllUsers = async (req: Request, res: Response) => {
        const users = await this.userService.getAllUsers();
        res.json({ success: true, data: users });
    };

    updateProfile = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const { name } = req.body;
        const user = await this.userService.updateUserProfile(userId, { name });
        res.json({ success: true, data: user });
    };
}
