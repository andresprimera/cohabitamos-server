import { Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CondominiumEntity } from 'src/entities/condominium.entity';
import { UnitEntity } from 'src/entities/unit.entity';

export class CreateVehicleDto {
  _id: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  condition: string;
  unit: string | Ref<UnitEntity>[];
  condominium: string | Ref<CondominiumEntity>[] | Types.ObjectId;
}
