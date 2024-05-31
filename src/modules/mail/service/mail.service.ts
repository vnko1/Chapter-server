import { join } from 'path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

type TemplateName = 'otpSend';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(mailerOptions: ISendMailOptions, templateName: TemplateName) {
    //    template: join(__dirname, '..', 'templates', templateName),
    const mailerDefaultOpt = {
      ...mailerOptions,
    };

    try {
      return await this.mailerService.sendMail(mailerDefaultOpt);
    } catch (error) {
      console.log('🚀 ~ MailService ~ sendEmail ~ error:', error);
      throw new HttpException(
        `Mail service error: ${JSON.stringify(error)}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
