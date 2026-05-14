import nodemailer from 'nodemailer';

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // For development, we'll use a simulated logger or Ethereal
    // In production, use real SMTP credentials from env
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.pass',
      },
    });
  }

  async sendInvitation(email: string, token: string, role: string) {
    const joinUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/join?token=${token}`;
    
    const mailOptions = {
      from: `"Task Manager Admin" <admin@taskmanager.com>`,
      to: email,
      subject: 'You have been invited to join the Task Management Workspace',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Workspace Invitation</h2>
          <p>Hello,</p>
          <p>You have been invited to join our team as a <strong>${role}</strong>.</p>
          <p>Click the button below to complete your registration and join the workspace:</p>
          <a href="${joinUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">
            Join Workspace
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            If you did not expect this invitation, you can safely ignore this email.
            <br>Link expires in 48 hours.
          </p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      // If using ethereal, log the preview URL
      if (nodemailer.getTestMessageUrl(info)) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send invitation email');
    }
  }
}
