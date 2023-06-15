import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { CondominiumEntity } from './condominium.entity';
import { STATUS } from 'src/common/enums';

enum PetEnum {
  DOG = 'Perro',
  CAT = 'Gato',
}

@modelOptions({
  schemaOptions: { collection: 'pets', timestamps: true },
})
export class PetEntity {
  @prop({ required: true, enum: PetEnum })
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
