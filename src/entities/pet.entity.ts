import { Ref, modelOptions, mongoose, prop } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { CondominiumEntity } from './condominium.entity';
import { PET_KIND, STATUS } from 'src/common/enums';

@modelOptions({
  schemaOptions: { collection: 'pets', timestamps: true },
})
export class PetEntity {
  _id: mongoose.Types.ObjectId;
  @prop({ required: true, enum: PET_KIND })
  kind: string;

  @prop()
  breed: string;

  @prop()
  name: string;

  @prop({ enum: STATUS, default: STATUS.PERMANENT })
  status: string;

  @prop({ ref: () => UnitEntity })
  unit: Ref<UnitEntity>[];

  @prop({ ref: () => CondominiumEntity })
  condominium: Ref<CondominiumEntity>[];
}
