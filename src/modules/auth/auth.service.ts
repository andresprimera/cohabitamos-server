import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async findSession(uid: any) {
    console.log({ uid });
    return await this.usersService.findByUid(uid).catch((err) => {
      Logger.error(err);
      throw new UnauthorizedException();
    });
  }
}
