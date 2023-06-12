import { Module } from '@nestjs/common';
import { RequirementTypesService } from './requirement-types.service';
import { RequirementTypesController } from './requirement-types.controller';

@Module({
  controllers: [RequirementTypesController],
  providers: [RequirementTypesService]
})
export class RequirementTypesModule {}
