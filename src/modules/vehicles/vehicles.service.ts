import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { VehiclesEntity } from 'src/entities/vehicle.entity';
import { Types } from 'mongoose';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(VehiclesEntity)
    private readonly vehicleRepository: ReturnModelType<typeof VehiclesEntity>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    Logger.log({ createVehicleDto });
    return await this.vehicleRepository
      .create(createVehicleDto)
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });
  }

  async findAll() {
    return await this.vehicleRepository.find().catch((error) => {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    });
  }

  async findOne(_id: Types.ObjectId) {
    const response = await this.vehicleRepository
      .findOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No vehicle was found for the provided _id');
    }

    return response;
  }

  async update(_id: Types.ObjectId, updateVehicleDto: UpdateVehicleDto) {
    const response = await this.vehicleRepository
      .findOneAndUpdate({ _id }, updateVehicleDto, {
        new: true,
      })
      .catch((error) => {
        Logger.log(error.message);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No vehicle was found for the provided _id');
    }

    return response;
  }

  async remove(_id: Types.ObjectId) {
    return await this.vehicleRepository.deleteOne({ _id }).catch((error) => {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    });
  }
}
