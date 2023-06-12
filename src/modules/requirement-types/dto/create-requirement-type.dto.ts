import { Ref, prop } from '@typegoose/typegoose';
import { Condominium } from 'gatewaySchemas';

export class CreateRequirementTypeDto {
  @prop({ required: true })
  value: string;

  @prop({ ref: () => Condominium })
  condominium: Ref<Condominium>;
}
