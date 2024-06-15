import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(mailerOptions: ISendMailOptions) {
    try {
      return await this.mailerService.sendMail(mailerOptions);
    } catch (error) {
      throw new HttpException(
        `Mail service error: ${JSON.stringify(error)}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  mailSendOpt(
    email: string,
    otp: string,
    variant: 'confirmEmail' | 'restoreAccount' | 'restorePassword',
  ) {
    switch (variant) {
      case 'confirmEmail':
        return {
          to: email,
          subject: 'Confirm your email',
          template: 'otp',
          context: {
            title: 'Chapter',
            text1: 'Welcome to chapter application!',
            text2:
              'To confirm your email, please enter this one-time password: ',
            text3: otp,
          },
        };
      case 'restoreAccount':
        return {
          to: email,
          subject: 'Restore your account',
          template: 'otp',
          context: {
            title: 'Chapter',
            text1: 'Welcome to chapter application!',
            text2:
              'To restore your account, please enter this one-time password: ',
            text3: otp,
          },
        };
      case 'restorePassword':
        return {
          to: email,
          subject: 'Restore your password',
          template: 'password',
          context: {
            title: 'Chapter',
            actionTitle: 'Chapter',
            url: process.env.CLIENT_URL + '/auth/change-password/' + otp,
            app_name: 'Chapter',
            text1: 'Trouble signing in?',
            text2: 'Resetting your password is easy.',
            text3:
              'Just press the button below and follow the instructions. We’ll have you up and running in no time.',
            text4:
              'If you did not make this request then please ignore this email.',
          },
        };
    }
  }
}
