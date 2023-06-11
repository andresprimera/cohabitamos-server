import { modelOptions, prop } from '@typegoose/typegoose';

export enum conditionEnum {
  OWNER = 'Propietario',
  TENANT = 'Arrendatario',
  RESIDENT = 'Residente',
  VISITOR = 'Visitante',
}

@modelOptions({
  schemaOptions: { collection: 'users_by_unit', timestamps: true },
})
export class UsersByUnitEntity {
  @prop({})
  unit: string; //ref+

  @prop({})
  user: string; //ref

  @prop({ enum: conditionEnum })
  condition: string;
}
