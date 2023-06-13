import { Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CondominiumEntity } from 'src/entities/condominium.entity';
import { UnitEntity } from 'src/entities/unit.entity';

export class CreatePetDto {
  _id: string;
  kind: string;
  breed: string;
  name: string;
  status: string;
  unit: string | Ref<UnitEntity>[];
  condominium: string | Ref<CondominiumEntity>[] | Types.ObjectId;
}
