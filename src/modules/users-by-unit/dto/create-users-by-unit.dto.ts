import { Types } from 'mongoose';
import { AUTHORIZATION_STATUS, USER_CONDITION } from 'src/common/enums';

export class CreateUsersByUnitDto {
  unit: Types.ObjectId;
  user: Types.ObjectId;
  condition: USER_CONDITION;
  status: AUTHORIZATION_STATUS;
}
