import { Ref, modelOptions, mongoose, prop } from '@typegoose/typegoose';
import { RequirementEntity } from './requirement.entity';
import { ShortUserEntity } from './user.entity';

export interface Record {
  field: keyof RequirementEntity;
  newValue: any;
  oldValue: any;
  timeElapsed?: number;
}

@modelOptions({
  schemaOptions: { collection: 'requirements_logs', timestamps: true },
})
export class RequirementsLogEntity {
  _id: mongoose.Types.ObjectId;

  @prop({ ref: () => RequirementEntity, required: true })
  requirementId: Ref<RequirementEntity>;

  @prop({ default: '' })
  message: string;

  @prop({ required: true })
  updatedBy: ShortUserEntity;

  @prop({ default: [] })
  records: Record[];
}
