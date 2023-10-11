import { Module } from '@nestjs/common';
import { UserRegistrationLinkService } from './user-registration-link.service';
import { UserRegistrationLinkController } from './user-registration-link.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserRegistrationLinkEntity } from 'src/entities/user-registration-link.entity';
import { UsersModule } from '../users/users.module';
import { UnitsModule } from '../units/units.module';
import { UsersByUnitModule } from '../users-by-unit/users-by-unit.module';

@Module({
  imports: [
    UsersModule,
    UnitsModule,
    UsersByUnitModule,
    TypegooseModule.forFeature([UserRegistrationLinkEntity]),
  ],
  controllers: [UserRegistrationLinkController],
  providers: [UserRegistrationLinkService],
})
export class UserRegistrationLinkModule {}
