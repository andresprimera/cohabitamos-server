import { modelOptions, prop } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { ShortUserEntity } from './user.entity';
import { CondominiumEntity } from './condominium.entity';
import { REQUIREMENT_STATE } from 'src/common/enums';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'requirements', timestamps: true },
})
export class RequirementEntity {
  _id: Types.ObjectId;

  @prop({ required: true })
  requirementType: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  unit: UnitEntity;

  @prop({ required: true })
  user: ShortUserEntity;

  @prop({ required: true })
  condominium: CondominiumEntity;

  @prop({ enum: REQUIREMENT_STATE, default: REQUIREMENT_STATE.OPEN })
  status: string;

  @prop({ default: null })
  assignee: ShortUserEntity | null;

  createdAt?: Date;

  updatedAt?: Date;
}
