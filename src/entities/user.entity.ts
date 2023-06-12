import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { Severity } from '@typegoose/typegoose';
import { DOC_TYPE, ROLE } from 'src/common/enums';
import { AccountEntity } from './account.entity';

@modelOptions({
  schemaOptions: { collection: 'users', timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class UserEntity {
  @prop({
    required: true,
  })
  uid: string;
  @prop({ required: true })
  firstName: string;
  @prop({ required: true })
  lastName: string;
  @prop({
    default: true,
  })
  active: boolean;
  @prop({ enum: ROLE, default: ROLE.USER })
  role: ROLE;
  @prop({ ref: () => AccountEntity, default: null })
  account: Ref<AccountEntity> | null;
  @prop({
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  })
  email: string;
  @prop({
    default: [],
  })
  phone: string[] | [];
  @prop({ default: '' })
  whatsapp: string;
  @prop({ enum: DOC_TYPE, default: DOC_TYPE.UNASSIGNED })
  docType: DOC_TYPE;
  @prop({ default: '' })
  docNumber?: string;
  @prop({ default: '' })
  nationality?: string;
}
