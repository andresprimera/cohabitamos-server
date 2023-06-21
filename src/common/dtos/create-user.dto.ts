import { Ref, prop } from '@typegoose/typegoose';
import { DOC_TYPE, ROLE, USER_CONDITION } from '../enums';
import { AccountEntity } from 'src/entities/account.entity';
import { Types } from 'mongoose';

export class CreateUserDto {
  @prop({})
  _id: string;

  @prop({})
  uid?: string;
  @prop({ required: true })
  firstName: string;
  @prop({ required: true })
  lastName: string;
  @prop({ enum: ROLE, default: ROLE.USER, required: true })
  role: ROLE;
  @prop({ ref: () => AccountEntity })
  account: Ref<AccountEntity>;
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

  @prop({ enum: USER_CONDITION, default: USER_CONDITION.RESIDENT })
  condition: string;

  @prop({})
  unit: Types.ObjectId;
}
