import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { CondominiumEntity } from './condominium.entity';

enum unitTypeEnum {
  APT = 'Apto',
  HOUSE = 'Casa',
  BUSINESS = 'Local',
}
enum PetEnum {
  DOG = 'Perro',
  CAT = 'Gato',
}

enum PetStatusEnum {
  RESIDENT = 'Residente',
  REMOVED = 'Retirado',
  VISITOR = 'Visita',
  DECEASED = 'Fallecido',
}

export class Pet {
  @prop({ required: true, enum: PetEnum })
  kind: string;

  @prop()
  breed: string;

  @prop()
  name: string;

  @prop({ enum: PetStatusEnum, default: PetStatusEnum.RESIDENT })
  status: string;
}

@modelOptions({
  schemaOptions: { collection: 'units', timestamps: true },
})
export class UnitEntity {
  @prop({})
  number: string;

  @prop({ enum: unitTypeEnum, default: unitTypeEnum.APT })
  type: string;

  @prop({})
  block: string;

  @prop({ ref: () => CondominiumEntity })
  condominium: Ref<CondominiumEntity>;

  @prop({ default: [] })
  pets: Pet[];
}
