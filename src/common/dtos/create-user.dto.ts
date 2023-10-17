import { DOCUMENT_TYPES, ROLES } from '../enums';
import { Types } from 'mongoose';

export class CreateUserDto {
  _id: string;
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
  condition: string;
  unit?: Types.ObjectId;
  password: string;
  condominium?: Types.ObjectId;
}
