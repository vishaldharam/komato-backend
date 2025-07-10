import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'; // ✅ CORRECT

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  async sendOTP(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL || 'Zomato App',
      to: email,
      subject: 'OTP for authentication',
      text: `Your OTP code is: ${otp}`,
    });
  }
}
