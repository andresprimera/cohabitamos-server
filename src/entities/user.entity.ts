import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { Severity } from '@typegoose/typegoose';
import { DOCUMENT_TYPES, ROLES } from 'src/common/enums';
import { AccountEntity } from './account.entity';
import mongoose, { Types } from 'mongoose';
import { CondominiumEntity } from './condominium.entity';

class Permissions {
  @prop({ ref: () => AccountEntity })
  account: Ref<AccountEntity>;

  @prop({ default: [] })
  condominiums: Ref<CondominiumEntity>[] | [];
}

@modelOptions({
  schemaOptions: { collection: 'users', timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class UserEntity {
  _id: mongoose.Types.ObjectId;

  @prop()
  uid: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({
    default: true,
  })
  active: boolean;

  @prop({ enum: ROLES, default: ROLES.USER })
  role: ROLES;

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

  @prop({ enum: DOCUMENT_TYPES, default: DOCUMENT_TYPES.UNASSIGNED })
  docType: DOCUMENT_TYPES;

  @prop({ default: '' })
  docNumber?: string;

  @prop({ default: '' })
  nationality?: string;

  @prop({ default: null })
  permissions: Permissions | null;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class ShortUserEntity {
  _id: Types.ObjectId;

  @prop({})
  firstName: string;

  @prop({})
  lastName: string;

  @prop({ enum: ROLES, default: ROLES.USER })
  role: ROLES;

  @prop({ default: null })
  permissions: Permissions | null;

  @prop({
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  })
  email: string;
}
