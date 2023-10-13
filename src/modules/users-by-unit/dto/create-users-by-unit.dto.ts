import { Types } from 'mongoose';
import { AUTHORIZATION_STATUS } from 'src/common/enums';

export class CreateUsersByUnitDto {
  unit: Types.ObjectId;
  user: Types.ObjectId;
  condition: string;
  status: AUTHORIZATION_STATUS;
}
