import { DOC_TYPE, ROLE } from '../enums';
import { Types } from 'mongoose';

export class CreateUserDto {
  _id: string;
  uid?: string;
  firstName: string;
  lastName: string;
  role: ROLE;
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
