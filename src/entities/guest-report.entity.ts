import { modelOptions, prop } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { UserEntity } from './user.entity';
import { VehiclesEntity } from './vehicle.entity';
import { PetEntity } from './pet.entity';

@modelOptions({
  schemaOptions: { collection: 'guest-reports', timestamps: true },
})
export class GuestReport {
  @prop({})
  arrivalDate: Date;

  @prop({})
  departureDate: Date;

  @prop({})
  guestQty: number;

  @prop({})
  unit: UnitEntity;

  @prop({})
  user: UserEntity;

  @prop({})
  pet: PetEntity;

  @prop({})
  vehicle: VehiclesEntity;
}
