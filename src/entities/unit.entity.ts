import { Ref, Severity, modelOptions, prop } from '@typegoose/typegoose';
import { CondominiumEntity } from './condominium.entity';
import { PetEntity } from './pet.entity';
import mongoose from 'mongoose';
import { UNIT_TYPES } from 'src/common/enums';

@modelOptions({
  schemaOptions: { collection: 'units', timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class UnitEntity {
  _id: mongoose.Types.ObjectId;

  @prop({})
  number: string;

  @prop({ enum: UNIT_TYPES, default: UNIT_TYPES.APT })
  type: string;

  @prop({})
  block: string;

  @prop({ ref: () => CondominiumEntity })
  condominium: Ref<CondominiumEntity>;
}
