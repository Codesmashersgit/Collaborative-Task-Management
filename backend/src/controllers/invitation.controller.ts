import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export class InvitationController {
  constructor(private prisma: PrismaClient) {}

  getInvitation = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const invitation = await this.prisma.invitation.findUnique({
        where: { token }
      });

      if (!invitation) {
        return res.status(404).json({ success: false, message: 'Invitation not found' });
      }

      if (new Date() > invitation.expiresAt) {
        return res.status(410).json({ success: false, message: 'Invitation has expired' });
      }

      res.json({ success: true, data: { email: invitation.email, role: invitation.role } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to verify invitation' });
    }
  };

  acceptInvitation = async (req: Request, res: Response) => {
    try {
      const { token, name, password } = req.body;
      
      const invitation = await this.prisma.invitation.findUnique({
        where: { token }
      });

      if (!invitation) {
        return res.status(404).json({ success: false, message: 'Invitation not found' });
      }

      if (new Date() > invitation.expiresAt) {
        return res.status(410).json({ success: false, message: 'Invitation has expired' });
      }

      // Create User
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: invitation.email,
          name,
          password: hashedPassword,
          role: invitation.role,
        }
      });

      // Delete Invitation
      await this.prisma.invitation.delete({ where: { token } });

      res.status(201).json({ success: true, data: user });
    } catch (error) {
      console.error('Accept invitation error:', error);
      res.status(500).json({ success: false, message: 'Failed to complete registration' });
    }
  };
}
