import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailService } from '.';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        const templatesDir = join(
          process.cwd(),
          'src',
          'modules',
          'mail',
          'templates',
        );

        return {
          transport: {
            host: process.env.MAIL_HOST,
            port: +process.env.MAIL_PORT,
            auth: {
              user: process.env.MAIL_USER_ID,
              pass: process.env.MAIL_USER_PASS,
            },
          },
          defaults: {
            from: process.env.MAIL_FROM_NAME,
          },
          template: {
            dir: templatesDir,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
