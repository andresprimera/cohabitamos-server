import { Module } from '@nestjs/common';
import { RequirementTypesService } from './requirement-types.service';
import { RequirementTypesController } from './requirement-types.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { RequirementTypeEntity } from 'src/entities/requirement-type.entity';

@Module({
  imports: [TypegooseModule.forFeature([RequirementTypeEntity])],
  controllers: [RequirementTypesController],
  providers: [RequirementTypesService],
})
export class RequirementTypesModule {}
