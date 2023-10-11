import { Types } from 'mongoose';
import { ShortUserEntity } from 'src/entities/user.entity';

export class CreateUserRegistrationLinkDto {
  unitId: Types.ObjectId;
  createdBy: ShortUserEntity;
  expirationTime: number; //milliseconds
  userId?: Types.ObjectId;
  email?: string;
  condition?: string;
}
