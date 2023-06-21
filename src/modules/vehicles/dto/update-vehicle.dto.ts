import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from '../../../common/dtos/create-vehicle.dto';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
