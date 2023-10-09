import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase-admin/app';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';

const jsonConfig = process.env.FIREBASE_CONFIG as string;
dotenv.config();

@Injectable()
export class Firebase {
  private static app: any;

  constructor(private readonly config: ConfigService) {
    if (!Firebase.app) {
      Firebase.app = initializeApp({
        credential: admin.credential.cert(
          JSON.parse(jsonConfig) as Partial<admin.ServiceAccount>,
        ),
      });
    }
  }

  getAuth() {
    return getAuth(Firebase.app);
  }
}
