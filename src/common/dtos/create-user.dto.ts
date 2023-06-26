import { Ref, prop } from '@typegoose/typegoose';
import { DOC_TYPE, ROLE, USER_CONDITION } from '../enums';
import { AccountEntity } from 'src/entities/account.entity';
import { Types } from 'mongoose';

export class CreateUserDto {
  _id: string;

  uid?: string;
  firstName: string;
  lastName: string;
  role: ROLE;
  account: Ref<AccountEntity>;

  email: string;

  phone?: string[] | [];
  whatsapp?: string;
  docType?: DOC_TYPE;
  docNumber?: string;
  nationality?: string;
  condition: string;
  unit: Types.ObjectId;
  password: string;
}
