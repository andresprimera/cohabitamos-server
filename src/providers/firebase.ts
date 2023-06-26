import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class Firebase {
  private static app: any;

  constructor(private readonly config: ConfigService) {
    if (!Firebase.app) {
      const firebaseConfig = {
        apiKey: this.config.get<string>('FIREBASE_API_KEY'),
        authDomain: this.config.get<string>('FIREBASE_AUTH_DOMAIN'),
        projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
        storageBucket: this.config.get<string>('FIREBASE_STORAGE_BUCKET'),
        messagingSenderId: this.config.get<string>(
          'FIREBASE_MESSANGIN_SERVER_ID',
        ),
        appId: this.config.get<string>('FIREBASE_APP_ID'),
        measurementId: this.config.get<string>('FIREBASE_MEASUREMENT_ID'),
      };
      Firebase.app = initializeApp({ credential: applicationDefault() });
    }
  }

  getAuth() {
    return getAuth(Firebase.app);
  }
}
