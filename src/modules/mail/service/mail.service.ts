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
}
