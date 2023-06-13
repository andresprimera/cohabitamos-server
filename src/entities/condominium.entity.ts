import { Ref, Severity, modelOptions, prop } from '@typegoose/typegoose';
import { AccountEntity } from './account.entity';
import mongoose, { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'condominiums', timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class CondominiumEntity {
  _id: mongoose.Types.ObjectId;

  @prop({ ref: () => AccountEntity })
  account: Ref<AccountEntity>;

  @prop({})
  address: string;

  @prop({})
  unitQty: number;

  @prop({})
  name: string;

  @prop({})
  email: string;

  @prop({ default: ['1'] })
  blocks: string[];
}
