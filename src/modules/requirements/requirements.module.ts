import { Module } from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { RequirementsController } from './requirements.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { RequirementEntity } from 'src/entities/requirement.entity';
import { UsersModule } from '../users/users.module';
import { CondominiumsModule } from '../condominiums/condominiums.module';
import { UnitsModule } from '../units/units.module';
import { UsersByUnitModule } from '../users-by-unit/users-by-unit.module';
import { RequirementsLogModule } from '../requirements-log/requirements-log.module';
import { NotificationService } from 'src/providers/notifications';

@Module({
  imports: [
    UsersModule,
    CondominiumsModule,
    UnitsModule,
    UsersByUnitModule,
    RequirementsLogModule,
    TypegooseModule.forFeature([RequirementEntity]),
  ],
  controllers: [RequirementsController],
  providers: [RequirementsService, NotificationService],
  exports: [RequirementsService],
})
export class RequirementsModule {}
