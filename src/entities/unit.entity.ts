import { modelOptions, prop } from '@typegoose/typegoose';

export enum unitTypeEnum {
  APT = 'Apto',
  HOUSE = 'Casa',
  BUSINESS = 'Local',
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

  @prop({})
  condominium: string;
}
