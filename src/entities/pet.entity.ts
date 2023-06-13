import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { CondominiumEntity } from './condominium.entity';

enum PetEnum {
  DOG = 'Perro',
  CAT = 'Gato',
}

enum PetStatusEnum {
  RESIDENT = 'Residente',
  REMOVED = 'Retirado',
  VISITOR = 'Visitante',
  DECEASED = 'Fallecido',
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

  @prop({ enum: PetStatusEnum, default: PetStatusEnum.RESIDENT })
  status: string;

  @prop({ ref: () => UnitEntity })
  unit: Ref<UnitEntity>[];

  @prop({ ref: () => CondominiumEntity })
  condominium: Ref<CondominiumEntity>[];
}
