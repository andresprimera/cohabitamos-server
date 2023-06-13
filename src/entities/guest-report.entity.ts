import { modelOptions, prop } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { UserEntity } from './user.entity';
import { VehiclesEntity } from './vehicle.entity';
import { PetEntity } from './pet.entity';
import { CondominiumEntity } from './condominium.entity';

@modelOptions({
  schemaOptions: { collection: 'guest-reports', timestamps: true },
})
export class GuestReportEntity {
  @prop({ required: true })
  arrivalDate: Date;

  @prop({ required: true })
  departureDate: Date;

  @prop({ default: 1 })
  guestQty: number;

  @prop({ required: true })
  unit: UnitEntity;

  @prop({ required: true })
  user: UserEntity;

  @prop({ default: null })
  pet: PetEntity;

  @prop({ default: null })
  vehicle: VehiclesEntity;

  @prop({ required: true })
  condominium: CondominiumEntity;
}
