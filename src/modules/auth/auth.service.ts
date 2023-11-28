import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/entities/user.entity';
import { ROLES } from 'src/common/enums';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async findSession(firebaseUser: UserEntity) {
    let user = await this.usersService
      .findByUid(firebaseUser.uid)
      .catch((err) => {
        Logger.error(err);
        throw new UnauthorizedException();
      })
      .catch((error) => {
        Logger.error(error);
      });

    if (!user) {
      user = await this.usersService.create({
        uid: firebaseUser.uid,
        active: false,
        firstName: '',
        lastName: '',
        role: ROLES.ADMIN,
        email: firebaseUser.email,
        password: '',
      });
    }

    return user;
  }
}
