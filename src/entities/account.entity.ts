import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from './user.entity';

export enum StatsEnum {
  ACTIVE = 'Activo',
  SUSPENDED = 'Suspendido',
  CLOSED = 'Cerrado',
}

@modelOptions({
  schemaOptions: { collection: 'accounts', timestamps: true },
})
export class AccountEntity {
  @prop({ ref: () => UserEntity })
  owner: Ref<UserEntity>;
  @prop({})
  startingDate: Date;
  @prop({})
  nextBillingDate: Date;
  @prop({ enum: StatsEnum, default: StatsEnum.ACTIVE })
  status: string;
}
