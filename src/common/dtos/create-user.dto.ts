import { DOCUMENT_TYPES, ROLES, USER_CONDITION } from '../enums';
import { Types } from 'mongoose';

export class CreateUserDto {
  _id?: Types.ObjectId;
  uid?: string;
  firstName: string;
  lastName: string;
  role: ROLES;
  email: string;
  phone?: string[] | [];
  whatsapp?: string;
  docType?: DOCUMENT_TYPES;
  docNumber?: string;
  nationality?: string;
  condition?: USER_CONDITION;
  unit?: Types.ObjectId;
  password: string;
  condominium?: Types.ObjectId;
  active?: boolean;
}
