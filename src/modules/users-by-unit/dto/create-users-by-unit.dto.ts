import { Types } from 'mongoose';

export class CreateUsersByUnitDto {
  unit: Types.ObjectId;
  user: Types.ObjectId;
  condition: string;
}
