import { Ref, prop } from '@typegoose/typegoose';
import { CondominiumEntity } from 'src/entities/condominium.entity';

export class CreateRequirementTypeDto {
  @prop({ required: true })
  value: string;

  @prop({ ref: () => CondominiumEntity })
  condominium: Ref<CondominiumEntity>;
}
