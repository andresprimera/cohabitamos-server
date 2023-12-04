import { forwardRef, Module } from '@nestjs/common';
import { UsersByUnitService } from './users-by-unit.service';
import { UsersByUnitController } from './users-by-unit.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersByUnitEntity } from 'src/entities/users-by-unit.entity';
import { UnitsModule } from '../units/units.module';
import { CondominiumsModule } from '../condominiums/condominiums.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Firebase } from 'src/providers/firebase';

@Module({
  imports: [
    UnitsModule,
    CondominiumsModule,
    forwardRef(() => UsersModule),
    TypegooseModule.forFeature([UsersByUnitEntity]),
  ],
  controllers: [UsersByUnitController],
  providers: [UsersByUnitService, NotificationsService, Firebase],
  exports: [UsersByUnitService],
})
export class UsersByUnitModule {}
