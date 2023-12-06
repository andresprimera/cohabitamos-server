import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { EMAIL_ACTIONS, NOTIFICATION_COLLECTIONS } from 'src/common/enums';
import { Firebase } from 'src/providers/firebase';

export interface ITemplate {
  name: EMAIL_ACTIONS;
  id: string;
}

export const emailTemplates: ITemplate[] = [
  {
    name: EMAIL_ACTIONS.GUEST_REPORT_CREATED,
    id: 'd-c259a0540bad47e9bbf73d2153e51530',
  },
  {
    name: EMAIL_ACTIONS.NEW_REQUEST_MESSAGE,
    id: 'd-e56a4876f210409ebabb895b75e81d76',
  },
  {
    name: EMAIL_ACTIONS.REQUEST_CREATED,
    id: 'd-bc6d4624fa3e45cdb8e224b70a40b04e',
  },
  {
    name: EMAIL_ACTIONS.UNIT_AUTH_REQUEST_APPROVED,
    id: 'd-474ef27d40714a48bce187527ff48fda',
  },
  {
    name: EMAIL_ACTIONS.UNIT_AUTH_REQUEST_CREATED,
    id: 'd-f0db73c1322a4aaa9237ab40e3c569ae',
  },
];

@Injectable()
export class NotificationsService {
  private sendgrid: any;

  constructor(private readonly firebase: Firebase) {
    this.sendgrid = sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  async sendEmail<T>({
    action,
    payload,
    to,
  }: {
    action: EMAIL_ACTIONS;
    to: string;
    payload: T;
  }) {
    const template = emailTemplates.find((t) => t.name === action);

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
      Logger.error('Sengrid sendEmail error =>', error);
    }
  }

  async sendEmailToAdmins({
    message,
    authorName,
    authorPhone,
    authorEmail,
  }: {
    message: string;
    authorName: string;
    authorPhone: string;
    authorEmail: string;
  }) {
    const msg = {
      to: 'andresprimera@gmail.com',
      from: 'noreplay@cohabitamos.com',
      subject: 'Cohabitamos - Nueva sugerencia',
      text: message,
      html: `<p><strong>${message}<strong></p><p>Nombre: ${authorName}</p><p>Teléfono: ${authorPhone}</p><p>Email: ${authorEmail}</p>`,
    };

    try {
      await this.sendgrid.send(msg).then(() => {
        Logger.log(`Sengrid suggestion message sent`);
      });
    } catch (error) {
      Logger.error('Sengrid  sendEmail error =>', error);
    }
  }

  async createFirebaseNotification<T>(payload: {
    collection: NOTIFICATION_COLLECTIONS;
    objectId: string;
    accountId: string;
    condominiumId: string;
    author?: string;
  }): Promise<void> {
    try {
      this.firebase.getFirestore().collection('notifications').add(payload);

      Logger.log('Firebase notification created');
    } catch (error) {
      Logger.error('error send push notification', error);
    }
  }
}
