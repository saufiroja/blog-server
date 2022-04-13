import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../models/User.models';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmedEmail(user: User) {
    const { email } = user;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to My App! Email Confirmed',
      template: 'Confirmed',
      context: {
        email,
      },
    });
  }

  async sendConfirmationEmail(user: any, code: any) {
    const { email } = await user;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to my App! Confirm Email',
      template: 'confirm',
      context: {
        email,
      },
      html: `<h1>Hello ${email} </h1>
      <p>Please Confirm your email with this code ${code}</p>`,
    });
  }
}
