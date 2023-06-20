// Import the functions you need from the SDKs you need
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReturnModelType } from '@typegoose/typegoose';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { InjectModel } from 'nestjs-typegoose';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  private defaultApp: any;

  constructor(private readonly config: ConfigService) {
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

    this.defaultApp = initializeApp(firebaseConfig);
  }

  async use(req: any, res: any, next: () => void) {
    const auth = getAuth(this.defaultApp);

    if (!req.headers?.authorization) {
      throw new UnauthorizedException('No token provided');
    }

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Incorrect token type');
    }

    const decodedToken = await auth.verifyIdToken(token).catch((error) => {
      return error;
    });

    if (
      !decodedToken?.uid
      // decodedToken.code === 'auth/argument-error' ||
      // decodedToken.code === 'auth/id-token-expired'
    ) {
      throw new UnauthorizedException('token could not be verified');
    }

    req.user = decodedToken;
    next();
  }
}
