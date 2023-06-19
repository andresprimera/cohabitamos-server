import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    //   ConfigModule.forRoot({}),
    //   JwtModule.registerAsync({
    //     useFactory: (configService: ConfigService) => {
    //       return {
    //         secret: configService.get<string>('JWT_SECRET'),
    //         signOptions: { expiresIn: '300s' },
    //       };
    //     },
    //     inject: [ConfigService],
    //   }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
