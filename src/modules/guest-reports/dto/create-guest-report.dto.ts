import { prop } from '@typegoose/typegoose';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { PetEntity } from 'src/entities/pet.entity';
import { UnitEntity } from 'src/entities/unit.entity';
import { UserEntity } from 'src/entities/user.entity';
import { VehiclesEntity } from 'src/entities/vehicle.entity';
import { CreatePetDto } from 'src/common/dtos/create-pet.dto';
import { CreateVehicleDto } from 'src/common/dtos/create-vehicle.dto';

export class CreateGuestReportDto {
  @prop()
  arrivalDate: Date;

  @prop()
  departureDate: Date;

  @prop({})
  guestQty: number;

  @prop()
  unit: string;

  @prop()
  user: CreateUserDto;

  @prop({})
  pet: CreatePetDto;

  @prop({})
  vehicle: CreateVehicleDto;
}
