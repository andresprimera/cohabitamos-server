import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../../common/dtos/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
