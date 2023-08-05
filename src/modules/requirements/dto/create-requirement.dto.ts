import { CreateUserDto } from 'src/common/dtos/create-user.dto';

export class CreateRequirementDto {
  requirementType: string;
  description: string;
  unit: string;
  status?: string;
  user: CreateUserDto;
  operator: string;
  isTask?: boolean;
  isUrgent?: boolean;
  isImportant?: boolean;
}
