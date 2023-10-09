import { Controller, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('findSession')
  findSession(@Request() req: any) {
    console.log({ req });
    return this.authService.findSession(req.uid);
  }
}
