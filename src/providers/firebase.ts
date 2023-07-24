import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class Firebase {
  private static app: any;

  constructor(private readonly config: ConfigService) {
    if (!Firebase.app) {
      Firebase.app = initializeApp({ credential: applicationDefault() });
    }
  }

  getAuth() {
    return getAuth(Firebase.app);
  }
}
