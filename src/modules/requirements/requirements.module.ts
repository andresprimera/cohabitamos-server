import { Module } from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { RequirementsController } from './requirements.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { RequirementEntity } from 'src/entities/requirement.entity';
import { UsersModule } from '../users/users.module';
import { CondominiumsModule } from '../condominiums/condominiums.module';
import { UnitsModule } from '../units/units.module';

@Module({
  imports: [
    UsersModule,
    CondominiumsModule,
    UnitsModule,
    TypegooseModule.forFeature([RequirementEntity]),
  ],
  controllers: [RequirementsController],
  providers: [RequirementsService],
})
export class RequirementsModule {}
