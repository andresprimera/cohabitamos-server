import { Ref, Severity, modelOptions, prop } from '@typegoose/typegoose';
import { CondominiumEntity } from './condominium.entity';
import { PetEntity } from './pet.entity';

enum unitTypeEnum {
  APT = 'Apto',
  HOUSE = 'Casa',
  BUSINESS = 'Local',
}

@modelOptions({
  schemaOptions: { collection: 'units', timestamps: true },
  options: { allowMixed: Severity.ALLOW },
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
}
