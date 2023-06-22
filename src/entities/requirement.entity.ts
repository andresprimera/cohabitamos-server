import { modelOptions, prop } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { UserEntity } from './user.entity';
import { CondominiumEntity } from './condominium.entity';
import { REQUIREMENT_STATE } from 'src/common/enums';

@modelOptions({
  schemaOptions: { collection: 'requirements', timestamps: true },
})
export class RequirementEntity {
  @prop({ required: true })
  requirementType: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  unit: UnitEntity;

  @prop({ required: true })
  user: UserEntity;

  @prop({ required: true })
  condominium: CondominiumEntity;

  @prop({ enum: REQUIREMENT_STATE, default: REQUIREMENT_STATE.OPEN })
  status: string;
}
