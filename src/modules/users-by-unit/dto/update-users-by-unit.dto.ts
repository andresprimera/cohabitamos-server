import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersByUnitDto } from './create-users-by-unit.dto';

export class UpdateUsersByUnitDto extends PartialType(CreateUsersByUnitDto) {}
