import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { CreatePetDto } from 'src/common/dtos/create-pet.dto';
import { CreateVehicleDto } from 'src/common/dtos/create-vehicle.dto';
import { CreateVisitorDto, Visitor } from 'src/common/dtos/create-visitor.dto';

export class CreateGuestReportDto {
  arrivalDate: Date;
  departureDate: Date;
  guestQty: number;
  unit: string;
  user: CreateUserDto;
  pet: CreatePetDto;
  vehicle: CreateVehicleDto;
  visitors: Visitor[];
}
