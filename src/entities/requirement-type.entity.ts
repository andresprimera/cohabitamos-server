import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { Condominium } from 'gatewaySchemas';

@modelOptions({
  schemaOptions: { collection: 'requirements_types', timestamps: true },
})
export class RequirementType {
  @prop({ required: true })
  value: string;

  @prop({ ref: () => Condominium })
  condominium: Ref<Condominium>;
}
