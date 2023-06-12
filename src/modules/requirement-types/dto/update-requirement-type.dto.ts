import { PartialType } from '@nestjs/mapped-types';
import { CreateRequirementTypeDto } from './create-requirement-type.dto';

export class UpdateRequirementTypeDto extends PartialType(CreateRequirementTypeDto) {}
