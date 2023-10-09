import { CreateUserDto } from 'src/common/dtos/create-user.dto';

export class CreateRequirementDto {
  requirementType: string;
  description: string;
  unit: string;
  status?: string;
  user: CreateUserDto;
  isTask?: boolean;
  isUrgent?: boolean;
  isImportant?: boolean;
}
