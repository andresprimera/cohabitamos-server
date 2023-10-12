import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { UnitEntity } from './unit.entity';
import { ShortUserEntity, UserEntity } from './user.entity';

@modelOptions({
  schemaOptions: { collection: 'user_registration_links', timestamps: true },
})
export class UserRegistrationLinkEntity {
  @prop({ required: true })
  unit: UnitEntity;

  @prop({ default: null })
  createdBy: ShortUserEntity | null;

  @prop({ default: false })
  used: boolean;

  @prop({ default: 172800000 }) // milliseconds = 48 hours
  expirationTime: number; //milliseconds

  @prop({ ref: () => UserEntity, nullable: true, default: null })
  createdUserId: Ref<UserEntity>;

  @prop({ default: null })
  email: Types.ObjectId | undefined;

  @prop({ default: null })
  user?: ShortUserEntity | null;

  createdAt: Date;
}
