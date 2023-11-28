import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async findSession(firebaseUser: UserEntity) {
    const user = await this.usersService
      .findByUid(firebaseUser.uid)
      .catch((err) => {
        Logger.error(err);
        throw new UnauthorizedException();
      })
      .catch((error) => {
        Logger.error(error);
      });

    // console.log('user =>', user);
    // console.log({ firebaseUser });

    // if (!user) {
    //   user = await this.usersService.create({
    //     email: firebaseUser.email,
    //     uid: firebaseUser.uid,
    //   });
    // }

    return user;
  }
}
