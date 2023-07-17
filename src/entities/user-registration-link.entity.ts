import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { ShortUserEntity, UserEntity } from './user.entity';

@modelOptions({
  schemaOptions: { collection: 'user_registration_links', timestamps: true },
})
export class UserRegistrationLinkEntity {
  @prop({ required: true })
  unit: UnitEntity;

  @prop()
  createdBy: ShortUserEntity;

  @prop({ default: false })
  used: boolean;

  @prop({ default: 172800000 }) // milliseconds = 48 hours
  expirationTime: number; //milliseconds

  @prop({ ref: () => UserEntity, nullable: true, default: null })
  createdUserId: Ref<UserEntity>;

  createdAt: Date;
}
