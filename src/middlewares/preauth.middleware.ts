// Import the functions you need from the SDKs you need
import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  private defaultApp: any;

  constructor(
    private readonly config: ConfigService,
    private readonly userRepository: UsersService,
  ) {
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

    if (!decodedToken?.uid) {
      throw new UnauthorizedException('token could not be verified');
    }

    req.uid = decodedToken.uid;

    if (req.headers?.operator) {
      req.body.operator = await this.userRepository
        .findOne(req.headers.operator)
        .catch((error) => {
          Logger.error(error);
          return error;
        });
    }
    next();
  }
}
