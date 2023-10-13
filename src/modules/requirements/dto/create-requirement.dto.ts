import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { REQUIREMENT_STATE } from 'src/common/enums';

export class CreateRequirementDto {
  requirementType: string;
  description: string;
  unit: string;
  status?: REQUIREMENT_STATE;
  user: CreateUserDto;
  isTask?: boolean;
  isUrgent?: boolean;
  isImportant?: boolean;
}
