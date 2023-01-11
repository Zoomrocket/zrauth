import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(configService.get('SENDGRID_API_KEY'));
  }

  async sendEmail(to: string, subject: string, body: string) {
    try {
      await sgMail.send({
        from: this.configService.get('SENDGRID_FROM'),
        to: to,
        subject: subject,
        html: body,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
