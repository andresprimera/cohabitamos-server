import { Ref, prop } from '@typegoose/typegoose';
import { UserEntity } from 'src/entities/user.entity';

export class CreateAccountDto {
  @prop({ ref: () => UserEntity })
  owner: Ref<UserEntity>;
}
