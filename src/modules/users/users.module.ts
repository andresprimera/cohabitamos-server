import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from '../../entities/user.entity';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersByUnitModule } from '../users-by-unit/users-by-unit.module';
import { UnitsModule } from '../units/units.module';
import { Firebase } from 'src/providers/firebase';

@Module({
  imports: [
    UnitsModule,
    UsersByUnitModule,
    TypegooseModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService, Firebase],
  exports: [UsersService],
})
export class UsersModule {}
