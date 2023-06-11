import { prop } from '@typegoose/typegoose';
import { DOC_TYPE, ROLE } from '../enums';

export class CreateUserDto {
  @prop({})
  _id: string;

  @prop({
    unique: true,
  })
  uid?: string;
  @prop({ required: true })
  firstName: string;
  @prop({ required: true })
  lastName: string;
  @prop({ enum: ROLE, default: ROLE.USER, required: true })
  role: ROLE;
  @prop({ required: true })
  account: string;
  @prop({
    trim: true,
    lowercase: true,
    required: true,
  })
  email: string;
  @prop({
    default: [],
  })
  phone?: string[] | [];
  @prop()
  whatsapp?: string;
  @prop({ enum: DOC_TYPE })
  docType?: DOC_TYPE;
  @prop({})
  docNumber?: string;
  @prop({})
  nationality?: string;
}
