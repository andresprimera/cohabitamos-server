import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from '../../entities/user.entity';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersByUnitModule } from '../users-by-unit/users-by-unit.module';
import { UnitsModule } from '../units/units.module';
import { Firebase } from 'src/providers/firebase';
import { AccountsModule } from '../accounts/accounts.module';
import { CondominiumsModule } from '../condominiums/condominiums.module';

@Module({
  imports: [
    UnitsModule,
    UsersByUnitModule,
    AccountsModule,
    CondominiumsModule,
    TypegooseModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService, Firebase],
  exports: [UsersService],
})
export class UsersModule {}
