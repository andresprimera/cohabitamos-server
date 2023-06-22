import { Types } from 'mongoose';
import { RequirementEntity } from 'src/entities/requirement.entity';

export interface RecordDto {
  field: keyof RequirementEntity;
  newValue: any;
}

export class CreateRequirementsLogDto {
  requirement: RequirementEntity;
  updatedBy: Types.ObjectId;
  message: string;
  records: RecordDto[];
}
