import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Firebase } from 'src/providers/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly firebase: Firebase,
  ) {}

  async signIn(email: string, password: string) {
    const auth = this.firebase.Auth();
    await signInWithEmailAndPassword(auth, email, password).catch((error) => {
      Logger.error(error.code, 'Error Code: ');
      Logger.error(error.message, 'Error message: ');
      throw new UnauthorizedException(error.message);
    });

    //If this runs, the user is authenticated

    const user = await this.usersService.findByEmail(email);

    const payload = { sub: user._id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
