import { modelOptions, prop } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { UserEntity } from './user.entity';
import { CondominiumEntity } from './condominium.entity';

export enum statusEnum {
  OPEN = 'Abierto',
  CLOSED = 'Cerrado',
  IN_PROGRESS = 'En curso',
  ON_HOLD = 'Esperando respuesta',
}

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

  @prop({ enum: statusEnum, default: statusEnum.OPEN })
  status: string;
}
