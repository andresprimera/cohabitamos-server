import { Severity, modelOptions, prop } from '@typegoose/typegoose';
import { Schema, Types } from 'mongoose';
import {
  ACCOUNT_STATES,
  AUTHORIZATION_STATUS,
  DEFAULT_REQUIREMENTS_TYPES,
  DOCUMENT_TYPES,
  EXECUTION_STATUS,
  PET_KIND,
  REQUIREMENT_STATE,
  ROLES,
  STATUS,
  UNIT_TYPES,
  USER_CONDITION,
  VISITORS_CONDITION,
} from 'src/common/enums';

@modelOptions({
  schemaOptions: { collection: 'options' },
  options: { allowMixed: Severity.ALLOW },
})
export class OptionsEntity {
  _id: { type: Types.ObjectId; auto: true };

  @prop({
    required: true,
    default: [...Object.values(ACCOUNT_STATES)],
  })
  ACCOUNT_STATES: ACCOUNT_STATES[];

  @prop({
    required: true,
    default: [...Object.values(REQUIREMENT_STATE)],
  })
  REQUIREMENT_STATE: REQUIREMENT_STATE[];

  @prop({ required: true, default: [...Object.values(STATUS)] })
  STATUS: STATUS[];

  @prop({ required: true, default: [...Object.values(PET_KIND)] })
  PET_KIND: PET_KIND[];

  @prop({ required: true, default: [...Object.values(UNIT_TYPES)] })
  UNIT_TYPES: UNIT_TYPES[];

  @prop({
    required: true,
    default: [...Object.values(USER_CONDITION)],
  })
  USER_CONDITIONS: USER_CONDITION[];

  @prop({
    required: true,
    default: [...Object.values(DOCUMENT_TYPES)],
  })
  DOCUMENT_TYPES: DOCUMENT_TYPES[];

  @prop({
    required: true,
    default: [...Object.values(DEFAULT_REQUIREMENTS_TYPES)],
  })
  DEFAULT_REQUIREMENTS_TYPES: DEFAULT_REQUIREMENTS_TYPES[];

  @prop({ required: true, default: [...Object.values(ROLES)] })
  ROLES: ROLES[];

  @prop({ required: true, default: [...Object.values(VISITORS_CONDITION)] })
  VISITORS_CONDITION: VISITORS_CONDITION[];

  @prop({ required: true, default: [...Object.values(EXECUTION_STATUS)] })
  EXECUTION_STATUS: EXECUTION_STATUS[];

  @prop({ required: true, default: [...Object.values(AUTHORIZATION_STATUS)] })
  AUTHORIZATION_STATUS: AUTHORIZATION_STATUS[];
}
