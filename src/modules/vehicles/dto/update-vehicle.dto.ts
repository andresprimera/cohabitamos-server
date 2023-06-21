import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from '../../../common/dtos/create-vehicle.dto';
import { Types } from 'mongoose';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
