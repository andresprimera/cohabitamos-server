import { Severity, modelOptions, prop } from '@typegoose/typegoose';
import {
  ACCOUNT_STATES,
  DEFAULT_REQUIREMENTS_TYPES,
  DOC_TYPE,
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
  @prop({
    default: [
      ACCOUNT_STATES.ACTIVE,
      ACCOUNT_STATES.CLOSED,
      ACCOUNT_STATES.SUSPENDED,
    ],
  })
  ACCOUNT_STATES: string[];

  @prop({
    default: [
      REQUIREMENT_STATE.OPEN,
      REQUIREMENT_STATE.CLOSED,
      REQUIREMENT_STATE.IN_PROGRESS,
      REQUIREMENT_STATE.ON_HOLD,
    ],
  })
  REQUIREMENT_STATE: string[];

  @prop({ default: [STATUS.PERMANENT, STATUS.RETIRED, STATUS.VISITOR] })
  STATUS: string[];

  @prop({ default: [PET_KIND.DOG, PET_KIND.CAT, PET_KIND.OTHER] })
  PET_KIND: string[];

  @prop({ default: [UNIT_TYPES.APT, UNIT_TYPES.HOUSE, UNIT_TYPES.BUSINESS] })
  UNIT_TYPES: string[];

  @prop({
    default: [
      USER_CONDITION.OWNER,
      USER_CONDITION.TENANT,
      USER_CONDITION.RESIDENT,
    ],
  })
  USER_CONDITIONS: string[];

  @prop({
    default: [
      DOC_TYPE.CC,
      DOC_TYPE.CE,
      DOC_TYPE.PA,
      DOC_TYPE.PEP,
      DOC_TYPE.OTHER,
      DOC_TYPE.UNASSIGNED,
    ],
  })
  DOCUMENT_TYPES: string[];

  @prop({
    default: [
      DEFAULT_REQUIREMENTS_TYPES.BILLING,
      DEFAULT_REQUIREMENTS_TYPES.CONDOMINIUM,
      DEFAULT_REQUIREMENTS_TYPES.PARKING,
      DEFAULT_REQUIREMENTS_TYPES.PETS,
      DEFAULT_REQUIREMENTS_TYPES.HELPERS,
      DEFAULT_REQUIREMENTS_TYPES.SECURITY,
      DEFAULT_REQUIREMENTS_TYPES.MAILING,
      DEFAULT_REQUIREMENTS_TYPES.COEXISTENCE,
    ],
  })
  DEFAULT_REQUIREMENTS_TYPES: string[];

  @prop({
    default: [ROLES.ADMIN, ROLES.OPERATOR, ROLES.USER, ROLES.SUPER_ADMIN],
  })
  ROLES: string[];

  @prop({
    default: [
      VISITORS_CONDITION.MAIN_GUEST,
      VISITORS_CONDITION.AUTHORIZED,
      VISITORS_CONDITION.HOME_ASSISTANT,
      VISITORS_CONDITION.RELATIVE,
      VISITORS_CONDITION.PROVIDER,
    ],
  })
  VISITORS_CONDITIONS: string[];
}
