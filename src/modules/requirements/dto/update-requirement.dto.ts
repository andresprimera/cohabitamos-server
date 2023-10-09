import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { CreateRequirementDto } from './create-requirement.dto';

export class UpdateRequirementDto extends PartialType(CreateRequirementDto) {
  operator: string;
  message: string;
  assignee?: Types.ObjectId;
  actualStartDate?: Date;
  actualEndDate?: Date;
  isUrget?: boolean;
  isImportant?: boolean;
}
