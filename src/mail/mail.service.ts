import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
// import { User } from '../models/User.models';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmedEmail(user: any) {
    const { email } = user;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to My App! Email Confirmed',
      template: 'Confirmed',
      context: {
        email,
      },
      html: `<p>Your account successfully actived right now</p>`,
    });
  }

  async sendConfirmationEmail(user: any, code: any, id: any) {
    const { email } = await user;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to my App! Confirm Email',
      template: 'confirm',
      context: {
        email,
      },
      html: `<h1>Hello ${email} </h1>
      <p>Please Confirm your email with this code ${code}, please follow the url below</p>
      <p>http://localhost:5000/api/auth/verify/${id}</p>
      `,
    });
  }
}
