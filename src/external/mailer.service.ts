import { Injectable } from '@nestjs/common';
import { keys } from 'src/keys';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailerService {
  constructor() {
    sgMail.setApiKey(keys.SENDGRID_API_KEY);
  }

  async sendEmail(to: string, subject: string, body: string) {
    try {
      await sgMail.send({
        from: keys.SENDGRID_FROM,
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
