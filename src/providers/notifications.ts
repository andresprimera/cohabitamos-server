import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { MailService } from '@sendgrid/mail';

interface Props {
  msgs: {
    from: string;
  };
}

@Injectable()
export class SengridService {
  private sendgrid: any;

  constructor() {
    this.sendgrid = sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  async sendEmail({ msgs }: Props) {
    console.log(process.env.SENDGRID_API_KEY);
    const msg = {
      to: 'andresprimera@gmail.com', // Change to your recipient
      from: 'noreply@cohabitamos.com', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    if (!msg?.from) msg.from = 'ACP-Support@tesspay.io';
    try {
      await this.sendgrid.send(msg);
    } catch (error) {
      console.error('Sengrid sendEmail error =>', error.response.body);
    }
  }
}
