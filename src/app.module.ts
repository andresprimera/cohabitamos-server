import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { CondominiumsModule } from './modules/condominiums/condominiums.module';
import { UnitsModule } from './modules/units/units.module';

@Module({
  imports: [
    UsersModule,
    AccountsModule,
    TypegooseModule.forRoot(
      'mongodb+srv://mainAppUser:ftvQf9WRXt6Mfis@cluster0.p0ufymh.mongodb.net/development',
    ),
    CondominiumsModule,
    UnitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
