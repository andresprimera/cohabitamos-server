import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { CondominiumEntity } from './condominium.entity';

@modelOptions({
  schemaOptions: { collection: 'requirements_types', timestamps: true },
})
export class RequirementTypeEntity {
  @prop({ required: true })
  value: string;

  @prop({ ref: () => CondominiumEntity })
  condominium: Ref<CondominiumEntity>;
}
