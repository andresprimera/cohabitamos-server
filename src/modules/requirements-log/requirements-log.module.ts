import { Module } from '@nestjs/common';
import { RequirementsLogService } from './requirements-log.service';
import { RequirementsLogController } from './requirements-log.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { RequirementsLogEntity } from 'src/entities/requirements-log.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsService } from '../notifications/notifications.service';
import { Firebase } from 'src/providers/firebase';

@Module({
  imports: [UsersModule, TypegooseModule.forFeature([RequirementsLogEntity])],
  controllers: [RequirementsLogController],
  providers: [RequirementsLogService, NotificationsService, Firebase],
  exports: [RequirementsLogService],
})
export class RequirementsLogModule {}
