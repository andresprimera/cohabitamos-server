import { Types } from 'mongoose';
import { UNIT_TYPES } from 'src/common/enums';

export class CreateUnitDto {
  number: string;
  type: UNIT_TYPES;
  block: string;
  condominium: Types.ObjectId;
}
