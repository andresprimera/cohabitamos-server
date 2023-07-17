import { PartialType } from '@nestjs/mapped-types';
import { DOC_TYPE, ROLES } from 'src/common/enums';
import { CreateUserDto } from '../../../common/dtos/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  uid?: string;
  firstName?: string;
  lastName?: string;
  role?: ROLES;
  email: string;
  phone?: string[] | [];
  whatsapp?: string;
  docType?: DOC_TYPE;
  docNumber?: string;
  nationality?: string;
  condition?: string;
  password?: string;
}
