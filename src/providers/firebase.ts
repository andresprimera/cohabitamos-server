import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase-admin/app';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config();
const jsonConfig = process.env.FIREBASE_CREDENTIALS as string;

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

  getFirestore() {
    return getFirestore(Firebase.app);
  }
}
