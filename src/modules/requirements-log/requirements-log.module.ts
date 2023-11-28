import { Module } from '@nestjs/common';
import { RequirementsLogService } from './requirements-log.service';
import { RequirementsLogController } from './requirements-log.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { RequirementsLogEntity } from 'src/entities/requirements-log.entity';
import { UsersModule } from '../users/users.module';
import { NotificationService } from 'src/providers/notifications';

@Module({
  imports: [UsersModule, TypegooseModule.forFeature([RequirementsLogEntity])],
  controllers: [RequirementsLogController],
  providers: [RequirementsLogService, NotificationService],
  exports: [RequirementsLogService],
})
export class RequirementsLogModule {}
