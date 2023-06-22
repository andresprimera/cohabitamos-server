import { Module } from '@nestjs/common';
import { RequirementsLogService } from './requirements-log.service';
import { RequirementsLogController } from './requirements-log.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { RequirementsLogEntity } from 'src/entities/requirements-log.entity';
import { RequirementsModule } from '../requirements/requirements.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    RequirementsModule,
    UsersModule,
    TypegooseModule.forFeature([RequirementsLogEntity]),
  ],
  controllers: [RequirementsLogController],
  providers: [RequirementsLogService],
})
export class RequirementsLogModule {}
