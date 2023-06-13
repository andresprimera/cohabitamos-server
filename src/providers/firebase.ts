// Import the functions you need from the SDKs you need
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

@Injectable()
export class Firebase {
  constructor(private readonly config: ConfigService) {}

  Auth() {
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

    const app = initializeApp(firebaseConfig);
    return getAuth(app);
  }
}
