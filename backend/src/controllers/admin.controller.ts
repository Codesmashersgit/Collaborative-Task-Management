import type { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';

export class AdminController {
  constructor(private adminService: AdminService) {}

  getStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.adminService.getSystemStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch system stats' });
    }
  };

  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.adminService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
  };

  updateRole = async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.body;
      if (!['ADMIN', 'MEMBER'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }
      const user = await this.adminService.updateUserRole(userId, role);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update user role' });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.adminService.deleteUser(id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.adminService.deleteTask(id);
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete task' });
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.adminService.inviteUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}


