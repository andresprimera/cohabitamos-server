import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ETemplates } from './enums';

import { templates } from './templates';

@Injectable()
export class NotificationService {
  private sendgrid: any;

  constructor() {
    this.sendgrid = sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  async sendEmail<T>({
    action,
    payload,
    to,
  }: {
    action: ETemplates;
    to: string;
    payload: T;
  }) {
    const template = templates.find((t) => t.name === action);

    const msg = {
      to,
      from: 'noreplay@cohabitamos.com',
      template_id: template?.id,
      dynamic_template_data: payload,
    };
    try {
      await this.sendgrid.send(msg).then(() => {
        Logger.log(`Sengrid message sent: ${action} to ${to}`);
      });
    } catch (error) {
      console.error('Sengrid sendEmail error =>', error.response.body);
    }
  }
}
