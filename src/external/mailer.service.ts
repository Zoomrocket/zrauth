import { Injectable } from "@nestjs/common";
import { createTransport } from "nodemailer";
import { keys } from "src/keys";

@Injectable()
export class MailerService {

    constructor() { }

    private readonly _transportService = createTransport({
        host: keys.SMTP_HOST,
        port: keys.SMTP_PORT,
        secure: true,
        auth: {
            user: keys.SMTP_USER,
            pass: keys.SMTP_PASS
        }
    })

    async sendEmail(to: string, subject: string, body: string) {
        try {
            await this._transportService.sendMail({
                from: keys.SMTP_FROM,
                to: to,
                subject: subject,
                html: body
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

}
