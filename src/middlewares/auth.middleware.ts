import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { Firebase } from 'src/providers/firebase';

@Injectable()
export class authMiddleware implements NestMiddleware {
  constructor(
    private readonly firebase: Firebase,
    private readonly userRepository: UsersService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const auth = this.firebase.getAuth();

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
