import { modelOptions, prop, Severity } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { ShortUserEntity } from './user.entity';
import { CondominiumEntity } from './condominium.entity';
import { REQUIREMENT_STATE } from 'src/common/enums';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'requirements', timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class RequirementEntity {
  _id: Types.ObjectId;

  @prop({ required: true })
  requirementType: string;

  @prop({ required: true })
  description: string;

  @prop({ default: null })
  unit?: UnitEntity | null;

  @prop({ default: null })
  user?: ShortUserEntity | null;

  @prop({ required: true })
  condominium: CondominiumEntity;

  @prop({ enum: REQUIREMENT_STATE, default: REQUIREMENT_STATE.OPEN })
  status: string;

  @prop({ default: null })
  assignee: ShortUserEntity | null;

  @prop({ default: false })
  isTask: boolean;

  @prop({ default: null })
  isUrgent: boolean;

  @prop({ default: null })
  isImportant: boolean;

  @prop({ default: null })
  estStartDate: Date;

  @prop({ default: null })
  estEndDate: Date;

  @prop({ default: null })
  actualStartDate: Date;

  @prop({ default: null })
  actualEndDate: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
