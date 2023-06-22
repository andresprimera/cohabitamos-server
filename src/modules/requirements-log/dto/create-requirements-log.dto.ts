import { Types } from 'mongoose';
import { RequirementEntity } from 'src/entities/requirement.entity';

export class CreateRequirementsLogDto {
  requirementId: Types.ObjectId;
  updatedBy: Types.ObjectId;
  mesaage: string;
  records: [
    {
      field: keyof RequirementEntity;
      newValue: any;
    },
  ];
}
