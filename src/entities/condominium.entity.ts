import { Severity, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { collection: 'condominiums', timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class CondominiumEntity {
  @prop({})
  account: string;

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
