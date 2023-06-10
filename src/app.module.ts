import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    UsersModule,
    TypegooseModule.forRoot(
      'mongodb+srv://mainAppUser:ftvQf9WRXt6Mfis@cluster0.p0ufymh.mongodb.net/development',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
